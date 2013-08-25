var probes = require("./probes");
var runjs = require("./run");
var spawn = require('child_process').spawn;

function getOutput(cmd, args, callback) {
    var proc = spawn(cmd, args);
    var outputLines = [];
    var err = null;
    
    proc.stdout.on("data", function(buf) {
        outputLines.push(buf.toString("ascii"));
    });
    
    proc.on("error", function(error) {
        err = error;
    });
    
    proc.on("exit", function() {
        callback(err, outputLines.join("\n"));
    });
}

probes.define("uptime", 0, function(callback) {
    getOutput("uptime", [], function(err, output) {
        if(err)
            return callback(err);
        var matches = output.match(/(.+)\s+(\d+)\s+users?,\s+load averages?:\s+(.+)/);
        if(!matches)
            return callback("pattern did not match: "+ output);
        var uptime = matches[1];
        var users = parseInt(matches[2], 10);
        var loads = matches[3].split(/\s+/).map(function(s) { return parseFloat(s, 10); });
        
        var days = 0;
        var hours = 0;
        var minutes = 0;
        
        if(uptime.indexOf("day") !== -1) {
            var result = uptime.match(/([0-9]+)\s+day/);
            if(result)
                days += parseInt(result[1], 10);
        }
        if(uptime.indexOf(":") !== -1) {
            var result = uptime.match(/([0-9]+):([0-9]+)/);
            if(result) {
                hours += parseInt(result[1], 10);
                minutes += parseInt(result[2], 10);
            }
        }
        if(uptime.indexOf("min") !== -1) {
            var result = uptime.match(/([0-9]+)\s+min/);
            if(result)
                minutes += parseInt(result[1], 10);
        }
        callback(null, {
            uptime: {days: days, hours: hours, minutes: minutes},
            users: users,
            loads: loads
        });
    });
});

/*
probes.define("unix/ps", 0, function(callback) {
    getOutput("ps", ["aux"], function(err, output) {
        if(err)
            return callback(err);
        var lines = output.split("\n");
        var processes = [];
        for (var i = 1; i < lines.length; i++) {
            var line = lines[i];
            var parts = line.split(/\s+/);
            var user = parts[0];
            var pid = parseInt(parts[1], 10);
            var cpuPerc = parseFloat(parts[2], 10);
            var memPerc = parseFloat(parts[3], 10);
            var cumTime = parts[9];
            var command = parts.slice(10).join(" ");
            if(!command) 
                continue;
            processes.push({
                user: parts[0],
                pid: pid,
                cpuPerc: cpuPerc,
                memPerc: memPerc,
                cumTime: cumTime,
                command: command
            });
        }
        callback(null, processes);
    });
});

*/

function readableSizeToByteSize(s) {
    if(s.indexOf("K") !== -1)
        return parseInt(s, 10);
    if(s.indexOf("M") !== -1)
        return parseInt(s, 10) * 1024;
    if(s.indexOf("G") !== -1)
        return parseInt(s, 10) * 1024 * 1024;
}

probes.define("stats", 0, function(callback) {
    if(process.platform === "sunos") {
        getOutput("prstat", ["-Z", "0", "1"], function(err, output) {
            if(err)
                return callback(err);
            var lines = output.split("\n");
            for (var i = 0; i < lines.length; i++) {
                if(lines[i].indexOf("ZONEID") !== -1) {
                    var cols = lines[i+1].split(/\s+/);
                    if(!cols[0]) cols = cols.slice(1);
                    var processCount = parseInt(cols[1], 10);
                    var swapUse = readableSizeToByteSize(cols[2]);
                    var memUse = readableSizeToByteSize(cols[3]);
                    var memPerc = parseFloat(cols[4], 10);
                    var cpuPerc = parseFloat(cols[6], 10);
                    return callback(null, {
                        processCount: processCount,
                        swapUse: swapUse,
                        memUse: memUse,
                        memPerc: memPerc,
                        cpuPerc: cpuPerc
                    });
                }
            }
            callback("did-not-find-zoneid");
        });
    }
    else {
        getOutput("top", ["-l", "1"], function(err, output) {
            //console.log(output);
            var result = {};
            var match = output.match(/Processes: (\d+)/);
            if(match)
                result.processCount = parseInt(match[1], 10);
            match = output.match(/CPU usage: ([^%]+)/);
            if(match)
                result.cpuPerc = parseInt(match[1], 10);
            callback(null, result);
        });
    }
});

probes.define("df", 0, function(callback) {
    getOutput("df", [process.platform === "sunos" ? "-B1024" : "-k"], function(err, output) {
        if(err)
            return callback(err);
        var lines = output.split("\n").slice(1);
        var results = {};
        lines.forEach(function(line) {
            var parts = line.split(/\s+/);
            if(parts.length > 1)
                results[parts[5]] = parseInt(parts[1], 10) * 1024;
        });
        callback(null, results);
    });
});

probes.define("run.js", 0, function(callback) {
    runjs.list(false, function(err, processes) {
        processes = processes.filter(function(process) {
            if(process.tag == "unix") return false;
            delete process.tp;
            delete process.out;
            process.status = process.ps ? "OK" : "FAIL";
            process.monStatus = process.monps ? "OK" : "FAIL";
            delete process.monps;
            delete process.ps.COMMAND;
            return true;
        });
        callback(null, processes);
    });
});

probes.define("vmstat", 0, function(callback) {
    if(process.platform === 'sunos')
        getOutput("vmstat", [], function(err, stdout) {
            if(err) return callback(err);
            var lines = stdout.split('\n'),
                head = lines[1].split(/\s+/);
            var obj = {};
            var item = lines[2].split(/\s+/);
            for (var col = 0; col < head.length - 1; col++)
                if(head[col])
                    obj[head[col]] = parseInt(item[col], 10);
            callback(null, obj);
        });
    else
        callback(null, "no-data");
});

probes.intervalProber(process.argv[2] || "unix", 10000, true);
runjs.reflector();
