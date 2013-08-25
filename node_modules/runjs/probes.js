var probes = {};

exports.define = function(name, interval, fn) {
    probes[name] = {
        fn: fn,
        interval: interval,
        lastExec: 0
    };
};

function probeAll(timeout, callback) {
    var now = Date.now();
    var names = [];
    for(var name in probes) {
        if(now - probes[name].lastExec >= probes[name].interval)
            names.push(name);
    }
    probeMulti(names, timeout, callback);
}

exports.probeAll = probeAll;

function probeMulti(names, timeout, callback) {
    var probesLeft = names.length;
    var results = {};
    
    names.forEach(function(name) {
        var timedOut = false;
        var startTime = Date.now();
        var timeoutId = setTimeout(function() {
            timedOut = true;
            results[name] = {
                err: "Probe timed out",
                result: null,
                latency: Date.now() - startTime
            };
            probesLeft--;
            if (probesLeft === 0)
                callback(null, results);
        }, timeout);
        probes[name].lastExec = Date.now();
        probes[name].fn(function(err, result) {
            if (timedOut)
                return;
            clearTimeout(timeoutId);
            results[name] = {
                err: err,
                r: result,
                l: Date.now() - startTime
            };
            probesLeft--;
            if (probesLeft === 0)
                callback(null, results);
        });
    });
    if(names.length === 0)
        callback(null, results);
}

exports.reflector = function(name){
    process.stdin.on('data', function(data) {
        probeAll(1000, function(err, result) {
            data = data.toString().replace(/\[\[\[\[\[\[(\d+)(.*)\]\]\]\]\]\]/g, function(m,a,b){
                return '[[[[[[' + a + ' ' + name + ' ' + JSON.stringify(result) + ']]]]]]';
            });
            process.stderr.write(data);
        });
    });
    process.stdin.resume();
}

exports.intervalProber = function(name, interval, now){
    function iter() {
        probeAll(interval * 0.8, function(err, result) {
            process.stderr.write('[[[[[[-1 ' + name + ' ' + JSON.stringify(result) + ']]]]]]');
        });
    }
    setInterval(iter, interval);
    if(now)
        iter();
}
