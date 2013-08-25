#!/usr/bin/env node
var cp = require("child_process");
var fs = require("fs");
var path = require("path");
var dgram = require("dgram");

// ------------------------------------------------------------------------------------------
//    configuration
// ------------------------------------------------------------------------------------------

var node_bin_self = process.platform === "sunos" ? "/shared/software/node6" : "node";
var node_bin_other = "node";

var runjswatch_bin = module.filename.replace(/run\.js$/,"")+"watcher";
var runjswatch_c   = runjswatch_bin + ".c";
var runjswatch_mode= 0550;
var cc_bin         = "gcc"

var kill_timeout    = 10000;
var probe_timeout   = 500;
var probe_start     = 500;
var launch_timeout  = 60000;
var command_poll    = 500;

var appname = "#m runjs# ";

function getTagPaths(tag) {
    var root = process.env.HOME + "/.runjs";
    var dir = root + "/" + tag
    return {
        root_mode: 0777,
        dir_mode: 0777,
        file_mode: 0666,
        root: root,
        dir: dir,
        out: dir + "/out",
        probe: dir + "/probe",
        command: dir + "/command",
        restarts: dir+ "/restarts",
        pid: dir + "/pid",
        monpid: dir + "/monpid",
        monlog: root + "/monlog"
    };
}

// ------------------------------------------------------------------------------------------
//    console printing
// ------------------------------------------------------------------------------------------

var colors = {
    bl: "30",   bo: "1",    r: "0;31",    g: "0;32",    y: "0;33",    b: "0;34",    m: "0;35",    c: "0;36",
    w: "0;37",    br: "1;31",    bg: "1;32",    by: "1;33",    bb: "1;34",    bm: "1;35",    bc: "1;36",    bw: "1;37"
}

function out() {
    for (var v = Array.prototype.slice.call(arguments), i = 0; i < v.length; i++) {
        v[i] = String(v[i]).replace(/\#(\w*)\s/g, function(m, a) {
            return "\033[" + (colors[a] || 0) + "m";
        }) + "\033[0m";
        process.stdout.write(v[i]);
    }
}

function outLen(str) { // decolorize for length
    return str.replace(/\#(\w*)\s/g, "").length;
}

function outPad(str, len, pad) { // decolorized padder
    return (str + Array(len).join(pad || ' ')).slice(0, len + (str.length - outLen(str)));
}

function monlog(tag, msg) {
    var paths = getTagPaths(tag);
    var fd = fs.openSync(paths.monlog, "a+");
    var msg =  "[" + tag + " "+process.pid+" " + (new Date).toString() + "] " + msg + "\n";
    fs.writeSync(fd, msg);
    fs.closeSync(fd);
    process.stdout.write(msg);
}

function shortDateTime(d) {
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}
// ------------------------------------------------------------------------------------------
//    tag string ops
// ------------------------------------------------------------------------------------------

function switchTag(tag) {
    var m = tag.match(/^(.+\.)(\d+)$/);
    if(!m)
        return tag + ".1";
    return m[1] + (parseInt(m[2], 10) + 1);
}

function isTagArchived(tag) {
    return tag && tag.indexOf("_archived_") != -1;
}

// ------------------------------------------------------------------------------------------
//    process utils
// ------------------------------------------------------------------------------------------

function kill9(pid, cb) {
    cp.exec('kill -9 ' + pid, function(error, stdout, stderr) {
        cb(error, stdout || stderr);
    });
}

function killtree9(pid, cb){
    childrenOfPid(pid, function(err, pidlist){
        if (err) return cb(err);

        kill9(pid, function (err) {
            if (err) return cb(err);

            var called = 0; // poor mans async.js
            pidlist.forEach(function (cpid) {
                kill9(cpid, function () {
                    if (++called === pidlist.length) // we're done invoke original cb
                        cb();
                });
            });
        });
    });
}

function childrenOfPid(pid, callback) {
    cp.exec("ps -A -oppid,pid", function(error, stdout, stderr) {
        if (error)
            return callback(stderr);

        var parents = {};
        stdout.split("\n").slice(1).forEach(function(line) {
            var col = line.trim().split(/\s+/g);
            (parents[col[0]] || (parents[col[0]] = [])).push(col[1]);
        });

        function search(roots) {
            var res = roots.concat();
            for (var c, i = 0; i < roots.length; i++) {
                if ((c = parents[roots[i]]) && c.length)
                    res.push.apply(res, search(c));
            }
            return res;
        }
        callback(null, search([pid]));
    });
};

function psaux(pid, cb) {
    cp.exec('ps aux' + (pid ? ' ' + pid : ''), function(error, stdout, stderr) {
        var lines = stdout.split('\n');
        if (error || (pid && lines.length != 3)) return cb(error);
        // parse output of ps aux into an object or array of objects with column name as key
        var out = [],
            head = lines[0].split(/\s+/);
        for (var row = 1; row < lines.length - 1; row++) {
            var obj = out[row - 1] = {};
            var item = lines[row].split(/\s+/);
            for (var col = 0; col < head.length - 1; col++)
            obj[head[col]] = item[col];
            obj[head[col]] = item.slice(col).join(' ');
        }
        cb(null, pid ? obj : out);
    });
}

function tail(file, lines, cb) {
    var p = cp.spawn('tail', ['-n', lines, file]),
        d = "";
    p.stdout.on('data', function(data) {
        d += data;
    });
    p.on('exit', function(code) {
        cb(code !== 0, d);
    });
    return p;
}

function follow(file, lines, cb) {
    var files;
    if(typeof file === "string")
        files = [file];
    else
        files = file;
    var p = cp.spawn('tail', ['-n', lines, '-f'].concat(files));
    p.stdout.on('data', function(data) {
        cb(null, data.toString());
    });
    p.stderr.on('data', function(data) {
        cb(null, data.toString());
    });
    return p;
}

// ------------------------------------------------------------------------------------------
//    tag operations
// ------------------------------------------------------------------------------------------

function tagInfo(tag, cb){
    var lastCall = 0, lastTotal = 0;

    var item = {
        tag: tag,
        tp: getTagPaths(tag),
        archived: isTagArchived(tag)
    };

    function last() {
        if (++lastCall === lastTotal) cb(null, item);
    }

    var tp = item.tp;
    if(!fs.statSync(tp.dir).isDirectory())
        return cb(null, null);

    try {
        item.pid = fs.readFileSync(tp.pid).toString();
        item.monpid = fs.readFileSync(tp.monpid).toString();
        item.restarts = fs.readFileSync(tp.restarts).toString();
    }
    catch (e) { }

    if(item.pid){
        lastTotal++;
        psaux(item.pid, function(err, obj) {
            this.ps = obj;
            last();
        }.bind(item));
    }
    if(item.monpid){
        lastTotal++;
        psaux(item.monpid, function(err, obj) {
            this.monps = obj;
            last();
        }.bind(item));
    }
    // fstat the pid for start time and uptime
    try {
        item.stime = fs.statSync(tp.monpid).ctime;
        item.atime = fs.statSync(tp.pid).ctime;
    }
    catch (e) { }
    // read a tail from stdout, stderr and put it in the list
    lastTotal++;
    tail(tp.out, 15, function(err, d) {
        this.out = d;
        last();
    }.bind(item));
}

function archiveTag(tag) {
    var tp = getTagPaths(tag);
    var tgt = tp.dir + '_archived_' + new Date().getTime();
    // rename the tag directory to archived with a datestamp
    try {
        fs.renameSync(tp.dir, tgt)
    }
    catch (e) {
        // fatal error in the daemon, what do we do?
        monlog(tag, "#br ERROR: # Cannot archive tag:" + tag + " from: " + tp.dir + " to: " + tgt + "\n" + e);
    }
}

function createTagPaths(tag, flags, script, cb){
    var tp = getTagPaths(tag);

    try {
        if (!fs.statSync(tp.root).isDirectory()) throw (0)
    }
    catch (e) {
        try {
            fs.mkdirSync(tp.root, tp.root_mode);
            fs.chmodSync(tp.root, tp.root_mode);
        }
        catch (e) {
            return cb("Cannot create root folder for processes " + tp.root + " \n" + e);
        }
    }

    // check if the script file actually exists before we try to start it
    try {
        if (!fs.statSync(script).isFile()) throw (0);
    }
    catch (e) {
        return cb("File does not exist: " + script);
    }
    // first we create the tagdir, operating as a mutexe
    try {
        fs.mkdirSync(tp.dir, tp.dir_mode);
        fs.chmodSync(tp.dir, tp.dir_mode);
    }
    catch (e) {
        // todo, detect dirty state and clean up some shit
        // check system startup time for dirty after reboot
        return cb("Tag collision detected, please give your process a new #by [tag] # or cleanup the existing process. " + e)
    }
    // how do we get our own name?
    cb();
}

function formatTaglist(out, tags){
    var cols = {
        'Tag': function(p) {
            return '#by ' + p.tag + '# '
        },
        'Status': function(p) {
            if (p.archived) return '#r archived # '
            if (!p.ps) return '#br FAIL # '
            return '#bg OK # '
        },
        'Restarts':function(p){
            return p.restarts !== undefined ? p.restarts : "0";
        },
        'PID': function(p) {
            return p.pid ? (p.archived ? ("#br (" + p.pid + ")# ") : p.pid) : "#br  X # ";
        },
        'MonPID': function(p) {
            return p.monpid ? (p.archived ? ("#br (" + p.monpid + ")# ") : p.monpid) : "#br  X # ";
        },
        'User': function(p) {
            return p.ps ? p.ps['USER'] : "#br  X # ";
        },
        'CPU': function(p) {
            return p.ps ? p.ps['%CPU'] : "#br  X # ";
        },
        'Mem': function(p) {
            return p.ps ? p.ps['%MEM'] : "#br  X # ";
        },
        'Uptime': function(p) {
            var now = new Date().getTime();
            if (!p.stime || !p.atime) return "#br X # ";
            var st = p.stime.getTime(),
                at = p.atime.getTime();
            var t = Math.floor((at - st) / 1000),
                pre = '',
                post = '',
                t2 = Math.floor((now - at) / 1000);
            if (t2 > 2) { // t2 is the diff between now and the last pid update. if > 2 secs, the monitor stopped doing that
                t = t2;
                pre = '#br ';
                post = p.monps ? ' Monitor not updating pid file # ' : ' Monitor down # ';
            }
            var s = t % 60,
                m = (t - s) % (60 * 60),
                h = (t - s - m) % (60 * 60 * 24),
                d = (t - s - m - h);
            return pre + (d ? (d / (60 * 60 * 24)) + 'd' : '') + (h ? (h / (60 * 60)) + 'h' : '') + (m ? (m / 60) + 'm' : '') + ('00' + s).slice(-2) + "s" + post;
        },
        "out": function(p) {

            if(!p.out)
                return "#br X # "

            // split it, then iterate top to bottom
            var lines = p.out.split("\n");
            var ix = lines.length - 1;
            while (--ix > 0) {
                // if the first char of this line is a word character
                if (/^\w/.test(lines[ix])) {
                    // break, because that is the first line of a stack trace probably
                    break;
                }
            }

            var spliced = lines.splice(ix,2);
            return spliced.join(" ").trim();
        }
    },
      begin = '',
      mid = '  ',
      end = '';

    var buf = [],
        max = {},
        last; // format cols and calculate widths

    for (var i = 0, p; i < tags.length; i++) {
        var b = buf[i] = {},
            p = tags[i];

        for (var c in cols) {
            last = c;
            var content = String(cols[c](p)) || ' ';
            if (content.indexOf("\n") > -1) {
                b.multiline = content.replace(/^\n|\n$/g, "");
                content = "";
            }
            max[c] = Math.max(max[c] || 0, outLen(c), outLen(b[c] = content));
        }
    }

    var s = begin; // build up the header
    for (var c in cols) {
        s += outPad(c, max[c]) + (c == last ? end : mid);
    }
    out(s+"\n");

    for (var i = 0; i < buf.length; i++) { // build up each process line
        var b = buf[i],
        s = begin;
        for (var c in cols) {
            s += outPad(b[c], max[c]) + (c == last ? end : mid);
        }
        out(s+"\n");
        if(b.multiline)
            out(b.multiline+"\n");
    }
}


// ------------------------------------------------------------------------------------------
//    actual monitor function
// ------------------------------------------------------------------------------------------

function startMonitor(tag, flags, script, args) {
    if (!tag || !script) {
        // we fail!.. no way to return an error
        monlog(tag, "No tag or script file passed to startmonitor, exiting");
        process.exit(-1);
        return;
    }

    var tp = getTagPaths(tag);
    // open stdout and stderr for write
    var outfile = fs.createWriteStream(tp.out, {
        flags: 'a+',
        encoding: null,
        mode: tp.file_mode
    });
    outfile.on('open',function(){
       fs.chmodSync(tp.out, tp.file_mode);
    });

    fs.writeFileSync(tp.command, "running");
    fs.chmodSync(tp.command, tp.file_mode);

    var restarting = true;
    var pi = setInterval(commandFilePoll, command_poll);
    var timers = {};

    function stopProcess(sig, restart) {
        restarting = restart;
        clearInterval(pi);
        timers.command = null;
        p.kill(sig);
    }

    function commandFilePoll() {
        try {
            var command = fs.readFileSync(tp.command).toString();
        }
        catch (e) {
            monlog(tag,"Error reading command file "+e)
            clearInterval(pi);
            pi = null;
            return;
        }
        switch(command) {
            case "running":
                break;

            default:
            case "stop":
                monlog(tag, "Stop command received, sending SIGTERM");
                stopProcess('SIGTERM', false);
                break;
            case "restart":
                monlog(tag, "Restart command received, sending SIGTERM");
                stopProcess('SIGTERM', true);
                break;
            case "testexception":
                // lets do a nice exception
                test_the_exception_handling();
                break;
            case "switch":
                // lets start ourselves with a new start-rev number, and send ourselves a shutdown signal
                monlog(tag, "Switch command received, starting new process");
                var newTag = switchTag(tag);
                clearInterval(pi);
                pi = null;

                exports.start(newTag, flags, script, args, function(err) {
                    if(err)
                        monlog(tag, err); // no return on purpose
                    setTimeout(function() {
                        monlog(tag, "Switch sending SIGHUP");
                        stopProcess('SIGHUP', false);
                    }, 30 * 1000);
                });

        }
        // cant write the file.. have to modify the modifystamp.
        fs.writeFileSync(tp.pid, ""+p.pid);
    }

    function gotSig() {
        if(p) {
            p.kill("SIGTERM");
            //archiveTag(tag);
            restarting = false;
        }
        else
            process.exit(0);
    }

    process.on("SIGINT", gotSig);
    process.on("SIGTERM", gotSig);

    var cmd = args ? args.slice(0) : [];
    cmd.unshift(script);
    if(flags['-nf'])
        cmd.unshift.apply(cmd, flags['-nf'].split(' '));

    monlog(tag, "Starting process "+node_bin_other+" "+cmd.join(' '));
    var nodebin = flags['-n']?flags['-n']:node_bin_other;
    var p = cp.spawn(nodebin, cmd, {
        env: process.env,
        cwd: process.cwd()
    });

    monlog(tag, "Started "+tag+" got pid:"+p.pid+" flags:"+JSON.stringify(flags)+" as:"+nodebin+" "+cmd.join(' '));

    p.stdin.on('error', function (){
        if(timers.probe)
            clearInterval(timers.probe);
        timers.probe = 0;
    });

    // store stuff to attempt last-ditch restart
    uncaught_exception_store = {
        tag: tag,
        flags: flags,
        script: script,
        args: args,
        tp : tp,
        pid : p.pid,
        timers: timers,
    }

    fs.writeFileSync(tp.monpid, ""+process.pid);
    fs.writeFileSync(tp.pid, ""+p.pid);

    function killTimeout(){
        monlog(tag, "Sending SIGKILL because messageloop appears dead");
        p.kill("SIGKILL");
    }

    function startProbing(){
        timers.kill = setTimeout(killTimeout, kill_timeout);

        timers.probe = setInterval(function(){
            try {
                if(p)
                    p.stdin.write('[[[[[['+(new Date().getTime())+']]]]]]');
            } catch(e) {
                monlog(null, "Could not write to input stream: " + e.message);
            }
        }, probe_timeout);
    }

    if(flags['-p']){
        if(!flags['-w'])
            setTimeout(startProbing, probe_start);
        else {
            timers.launch = setTimeout(function(){
                monlog(tag, "Sending SIGKILL because waitfor condition timed out");
                p.kill("SIGKILL");
            },  flags['-lt'] ? parseInt(flags['-lt'], 10)*1000 : launch_timeout);
        }
    }

    if(flags['-m']) {
        var udpClient = dgram.createSocket("udp4");
        var parts = flags['-m'].split(':');
        var udpHost = parts[0];
        var udpPort = parseInt(parts[1], 10);
    };

    var stderr_buffer = '';
    p.stderr.on('data', function(data) {
        if(timers.kill) {
            clearTimeout(timers.kill);
            timers.kill = setTimeout(killTimeout, kill_timeout);

            var d = stderr_buffer + data.toString();
            if(d.indexOf("[[[[[[") !== -1 && d.indexOf("]]]]]]") === -1)
                stderr_buffer = d;
            else {
                var now = new Date().getTime();
                d = d.replace(/\[\[\[\[\[\[(\-?\d+)(.*?)\]\]\]\]\]\]/g,function(m, stamp, rest){
                    var delta = now - parseFloat(stamp);
                    try {
                        var fd = fs.openSync(tp.probe, 'a+', tp.file_mode);
                        fs.writeSync(fd, shortDateTime(new Date()) + " - " + delta+" "+rest+"\n");
                        fs.closeSync(fd);
        				if(flags['-m'] && rest) {
    	                    var buf = new Buffer("[[[[[["+rest+"]]]]]]");
    	                    udpClient.send(buf, 0, buf.length, udpPort, udpHost);
    	                }
                    } catch(e) {
                        monlog(null, "Failed to write to probe file: " + e.message);
                    }
                    return ''; 
                });
                stderr_buffer = '';
                outfile.write(d);
            }
        } else {
            outfile.write(data);
        }
    });
    
    p.stdin.on('error', function() {    
        if (timers.probe)
            clearInterval(timers.probe);
        timers.probe = 0;  
    });

    var init_stdout = "";
    p.stdout.on('data', function(data) {
        outfile.write(data);
        if(flags['-w'] && !timers.probe){ // we need to be watching for start condition to begin probing
            init_stdout += data.toString();
            if(init_stdout.indexOf(flags['-w']) != -1){
                monlog(tag, "Probe start wait condition met ("+flags['-w']+")");
                clearTimeout(timers.launch);
                startProbing();
            }
        }
    });

    p.on('exit', function(code) {
        if(timers.kill)
            clearTimeout(timers.kill);
        if(timers.probe)
            clearTimeout(timers.probe);

        outfile.write("--- Process "+p.pid+" exited with code "+code+".----\n");
        outfile.end();
        if (pi) clearInterval(pi);
        pi = null;
        p = null;

        if (restarting){
            try{
                var restarts = parseInt(fs.readFileSync(tp.restarts), 10) + 1;
            } catch(e){
                restarts = 1;
            }
            monlog(tag, "Process exit received, restarting counter:"+restarts+" exit code:"+code);
            fs.writeFileSync(tp.restarts, ""+restarts);
            startMonitor(tag, flags, script, args);
        }
        else {
            monlog(tag, "Process exit received, archiving. exit code:"+code);

            archiveTag(tag);

            process.exit(0);
        }

    });
}

// ------------------------------------------------------------------------------------------
//    module API
// ------------------------------------------------------------------------------------------

exports.reflector = function(on){
    process.stdin.on('data', function(data){
        data = data.toString().replace(/\[\[\[\[\[\[(\d+)(.*)\]\]\]\]\]\]/g, function(m,a,b){
            return '[[[[[['+a+']]]]]]';
        });
        process.stderr.write(data);
        // parse data and inject status
    });
    process.stdin.resume();
}

exports.start = function(tag, flags, script, args, cb) {
    createTagPaths(tag, flags, script, function(err){
        if(err)
            return cb(err);

        var a = [node_bin_self, module.filename, "monitor", tag, JSON.stringify(flags), script];
        a = a.concat(args);
        var p = cp.spawn(runjswatch_bin, a), d = "";

        p.stdout.on('data', function(data) {
            d += data;
        });
        p.stderr.on('data', function(data) {
            d += data;
        });
        p.on('exit', function(code) {
            cb(code != 0 ? code + " " + d : null, d);
        });
            /*
            var newargs = [tag, script];
            newargs = newargs.concat(args)
            cp.fork(module.filename, newargs, {
                env: process.env,
                cwd: process.cwd
            });*/
    });
    // we can now auto-tail the process if needed
    //    process.exit(0);
}

exports.find = function(tag, cb) {
    var tp = getTagPaths("");
    fs.readdir(tp.root, function(err, dir) {
        if (err)
            return cb(err);
        for (var i = 0; i < dir.length; i++) {
            if(dir[i].replace(/\.\d+$/, "") === tag)
                return tagInfo(dir[i], cb);
        }
        cb("Tag not found: " + tag);
    });
};

exports.stop = function(tag, out, cb) {
    exports.find(tag, function(err, p) {
        if(err)
            return cb(err);

        if(!p.monps){
            if(p.ps){
                out("#br Cannot stop monitor without process, calling kill instead " + p.tag+"\n");
                return exports.kill(tag, out, cb);
            }
            out("Process appears #br DEAD # , archiving instead of stopping ..");
            archiveTag(tag);
            out("OK\n");
            return cb(err);
        }
        out("#bg Stopping: #by " + p.tag + " # pid:" + p.pid + " monitor:" + p.monpid + " ");

        try {
            fs.writeFileSync(p.tp.command, "stop");
        } catch(e) {
            cb("Cannot write to command file.");
        }
        var int = setInterval(function() {
            if(!path.exists(p.tp.dir)) {
                clearInterval(int);
                out("OK\n");
                cb();
            }
            else
                out(".");
        }, 100);
    });
}

exports.switch = function(tag, out, cb) {
    exports.find(tag, function(err, p) {
        if(err)
            return cb(err);

        out("#bg Switching # tag #by " + p.tag + " # with PID " + p.pid + " and monitor " + p.monpid + " ");

        try {
            fs.writeFileSync(p.tp.command, "switch");
        } catch(e) {
            cb("Cannot write to command file.");
        }
        var int = setInterval(function() {
            if(!path.exists(p.tp.dir)) {
                clearInterval(int);
                out("OK\n");
                cb();
            }
            else
                out(".");
        }, 100);
    });
}

exports.restart = function(tag, cb) {
    exports.find(tag, function(err, p) {
        if(err)
            return cb(err);

        // check if monitor is down, ifso we can only 'restart' it with the same args n all
        out("#bg Restarting # tag #by " + p.tag + " # with PID " + p.pid + " and monitor " + p.monpid + " ");

        try {
            fs.writeFileSync(p.tp.command, "restart");
        } catch(e) {
            cb("Cannot write to command file.");
        }
        var int = setInterval(function() {
            if(!path.exists(p.tp.dir)) {
                clearInterval(int);
                out("OK\n");
                cb();
            }
            else
                out(".");
        }, 100);
    });
}

exports.tail = function(out, tag) {
    exports.find(tag, function(err, p) {
        if(err)
            return out(err);
        follow(p.tp.out, 20, function(err, entry) {
           process.stdout.write(entry);
        });
    });
}

exports.kill = function(tag, out, cb) {
    monlog("api","Kill called on tag:" + tag);
    exports.find(tag, function(err, p) {
        if(err || !p)
            return cb(err);

        if (p.archived)
            return cb("#br Can't kill archived process\n");

        var calls = 0;
        out("#br Killing # " + p.tag+" ")

        if (p.monpid) {
            calls++;
            out("monitor:" + p.monpid +" ");
            killtree9(p.monpid, function(err, sout) {
                if (err || sout) out("#br ERROR ");
                else out("OK ");
                if(!--calls) end();
            });
        }
        if (p.pid) {
            out("process:" + p.pid + " ")
            calls++;
            killtree9(p.pid, function(err, sout) {
                if (err || sout) out("#br ERROR ");
                else out("OK ");
                if(!--calls) end();
            });
        }
        if(!calls) end();
        function end(){
            out("archiving: "+tag+" ")
            archiveTag(tag);
            out("OK\n");
            monlog("api","Killed tag:"+p.tag+" pid:"+p.pid+" monpid:"+p.monpid);
            cb();
        }
    });
}
// kill all run.js-like processes and archive everything in the runjs directory

exports.panic = function(out, cb) {
    monlog("api","Panic called, killing all runjs processes");
    exports.list(false, function(err, rjslist) {
        if (err) return cb(err);
        if(!rjslist || !rjslist.length)
            return cb();
        function killerr(err, sout){
            if(err && !err.toString().match(/No such process/))
                out("Kill returned "+err+"\n");
        }

        for (var i = 0; i < rjslist.length; i++) {
            var p = rjslist[i];
            if (p.archived) continue;
            out("#br Killing # " + p.tag+" ")
            if (p.monpid) {
                out("monitor:" + p.monpid +" ");
                killtree9(p.monpid, killerr);
            }
            if (p.pid) {
                out("process:" + p.pid + " ")
                killtree9(p.pid, killerr);
            }
            // lets archive the process dir
            out("archiving:"+p.tag+" ")
            archiveTag(p.tag);
            out("OK\n");
            monlog("api", "Panic kill and archive "+p.tag+" pid:"+p.pid+" monpid:"+p.monpid);
        }
        psaux(null, function(err, pslist) {
            if (err) return cb(err);
            for (var i = 0; i < pslist.length; i++) {
                var ps = pslist[i];
                if (ps.COMMAND && ps.COMMAND.match(/runjswatch|(\s|\/)run\.js\s/) && ps.PID != process.pid && !ps.COMMAND.match(/panic$|clean$/)) {
                    //console.log(process.pid, ps.PID);
                    out("#br Killing # "+ps.COMMAND+"(" + ps.PID + ")" )
                    killtree9(ps.PID, killerr);
                }
            }
            cb();
        });
    })
}

exports.list = function(wantArchived, cb) {
    // lets list all processes we have, including archived ones
    var tp = getTagPaths("");
    fs.readdir(tp.root, function(err, dir) {
        if (err) return cb(err);

        // for each directory lets list all files to build up our process list
        var cbcount = 0, cbtotal = 0, list = [];

        for (var i = 0; i < dir.length; i++) {
            if(isTagArchived(dir[i])){
                if(!wantArchived) continue;
                list.push({tag:dir[i], archived:true})
            } else {;
                cbtotal++;
                tagInfo(dir[i], function(err,t){
                    if(t)
                        list.push(t);
                    if(++cbcount == cbtotal)
                        cb(null, list);
                });
            };
        }
        if(!cbcount)
            cb(null, null);
    });
}

if (module.parent) // are we being used as a module?
    return;

// ------------------------------------------------------------------------------------------
// exception handler to print exception in log. runjswatch will restart us
// ------------------------------------------------------------------------------------------

var uncaught_exception_store = null;
process.on("uncaughtException", function(err) {
    var s = uncaught_exception_store;
    monlog(s?s.tag:"", "FATAL Monitor Exception "+process.pid+" "+err.message+"\n"+err.stack);
    process.exit(-1);
});

// ------------------------------------------------------------------------------------------
//    Commandline implementation (calls the API)
// ------------------------------------------------------------------------------------------

// check if daemonize exists, otherwise compile it
if(!path.existsSync(runjswatch_bin)){
    out("#br Runjswatch is not available, attempting to build it....\n");
    var p = cp.spawn(cc_bin, [runjswatch_c,"-o",runjswatch_bin,"-v", process.platform === 'sunos'?"-lsocket":""]);

    function stdoutw(d){process.stdout.write(d);}
    p.stdout.on('data',stdoutw);
    p.stderr.on('data',stdoutw);

    p.on('exit',function(code){
        if(code)
            out("#br Runjswatch build failed\n");
        else{
            if(!path.existsSync(runjswatch_bin))
                out("\Runjswatch built, but binary still not found.\n");
            else{
                try{
                    fs.chmodSync(runjswatch_bin, runjswatch_mode);
                    out("\Runjswatch built #bg OK # \n");
                }catch(e){
                    out("\Runjswatch built, but chmod failed\n");
                }
            }
        }
        process.exit(0);
    });
    return;
}

var args = process.argv.slice(2);

function help() {
    var n = "#m " + appname + "# "
    out("usage: " + n + " #bg [action] #by [tag] #bc [script] #bb [script arguments] \n")
    out("\n")
    out(n + " is the easiest way to run node.js scripts as daemons and monitor them\n")
    out("a tag is a short identifier you can use to name and select a process, it is the script filename by default\n")
    out("\n")
    out(n + " calling runjs without arguments list running processes with latest stdout/err\n")
    out(n + " #by [flags] #bc jsfile[.js] #bb [arguments] #w start a process with runjs, the tag is the jsfile name\n")
    out("flags: #by -s # show stdout/err immediately after startup\n")
    out("       #by -n:nodebin # start stuff with another node binary\n")
    out("       #by -c:clusternodes # how many clusternodes to start\n")
    out("       #by -w:waitfor # the process startup is verified with a waitfor string\n")
    out("       #by -p # probe the process to see if its alive using stdin/out probing\n")
    out("       #by -m:host:port # send probing information via UDP to host:port\n")
    out("       #by -t:tag # provide process tag explicitly, normally its the filename of your .js file\n")
    out("       #by -nf:nodeflags # provide custom node command line arguments\n")
    out(n + " #bg stop #by tag #w stop particular process nicely\n")
    out(n + " #bg kill #by tag #w kills a particular process with kill -9\n")
    out(n + " #bg switch #by tag #w start process again and trigger old one to shutdown with a signal\n")
    out(n + " #bg clean #w kills everything and cleans up runjs state" + appname+"\n")
    out(n + " #bg show #by tag #w shows process stdout/err\n")
    out(n + " #bg help #w show this help\n")
    out("\n")
}

if (args.length == 1 && args[0].match(/^[\-\/]*([h\?]|help)$/)) {
    return help();
}

if (args.length == 0 || args[0].match(/^(\-l|list|listall)/i)) {
    exports.list(args[0] && args[0].match(/^listall$/i), function(err, tags) {
        if (err)
            return out("#br ERROR # trying to list "+appname+" processes: " + err+"\n");
        if(!tags || !tags.length)
            return out("No "+appname+" processes running\n");
        formatTaglist(out, tags);
    });
    return;
}

if(args[0].match(/^monitor$|^reload:/i)){
    if(!args[1] || !args[2] || !args[3]){
        out('#brERROR: # please call internal monitor function correctly if you must: [tag] [flagsjson] [script] [args]');
        return process.exit(0);
    }
    if(args[0].match(/^reload:/i)){
        monlog(args[1], "Monitor died hard, cleaning up. Last output in crash:\n-------------- Start dump ------------\n" + args[0].slice(7)+"\n--------------- End dump --------------");
        exports.kill(args[1], function(d){}, function(err){
            if(err)
                monlog(args[1], "Reload kill failed with: "+err);
            createTagPaths(args[1], args[2], args[3], function(err){
                if (err) monlog(args[1], "Reload createPaths failed with "+err)
                startMonitor(args[1], JSON.parse(args[2]), args[3], args.slice(4));
            });
        })
    } else {
        createTagPaths(args[1], args[2], args[3], function(err){
            startMonitor(args[1], JSON.parse(args[2]), args[3], args.slice(4));
        });
    }
    // the keepalive for runjswatch
    setInterval(function(){
       process.stdout.write("1");
    }, 500);
    return;
}

if (args[0].match(/^stop$/i)) {
    return exports.stop(args[1],out,
        function(err) {
            if (err) out("#br ERROR: # " + err+"\n")
        });
}

if (args[0].match(/^kill$/i)) {
    return exports.kill(args[1], out,
        function(err) {
            if (err) out("#br ERROR: # " + err+"\n")
        });
}

if (args[0].match(/^switch/i)) {
    return exports.switch(args[1],out,
        function(err) {
            if (err) out("#br ERROR: # " + err+"\n");
        });
}

if (args[0].match(/^restart/i)) {
    return exports.restart(args[1],
		function(err) {
        	if (err) out("#br ERROR: # " + err+"\n");
    	});
}

if (args[0].match(/^(?:clear|clean|cleanup|panic)$/i)) {
    return exports.panic(out, function(err) {
        if (err) out("#br ERROR: # " + err+"\n")
        else out("Cleanup #bg OK# "+"\n");
    });
}

if (args[0].match(/^monlog/i)) {
    var paths = getTagPaths("");
    out("Tailing monitor log");
    return follow(paths.monlog, 10, function(err, msg) {
        process.stdout.write(msg);
    });
}

if (args[0].match(/^tail$/i)) {
    return exports.tail(out, args[1]);
}

if (args[0].match(/^cluster$/i)) {
}

var startcmd = ""
if (args[0].match(/^(start|run)$/i)) startcmd = args.shift();

// parse out monitor flags
var flags = { };
while(args.length){
    if(args[0] && args[0].charAt(0) != '-') break;
    var n = args.shift(), k = '';
    n = n.replace(/(\-[a-zA-Z]+)\:?/,function(m,a){
        k = a.toLowerCase();
        return '';
    });
    if(!k){
        out('#br ERROR: # Invalid argument: ' + args[0] + "\n");
        process.exit(-1);
        return;
    }
    flags[k] = n || 1;
}
var tag = args[0].replace(/.js$/i,"");
if(flags['-t'])
    tag = flags['-t'];

out(appname + " starting script: #bc " + args[0] + " # with tag #by " + tag + "\n");
exports.start(tag, flags, args.shift(), args, function(err, d) {
    if (err)
        out("#br ERROR: # " + err + "\n")

    process.exit(0);
});
