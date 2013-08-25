
var waitForTracker = {};


exports.makeParallel = exports.makeParallelWaitFor = function(callback) {
    var id = new Date().getTime();
    var c = 0;
    var error = undefined;
    return function waitFor() {
        function runWorker(name, args) {
            var worker = args.pop();
            args.push(function(err) {
                if (err) error = err;
                c -= 1;
                waitForTracker[id][name] = "done";
                if (c === 0 && callback) {
                    callback(error);
                    callback = false;
                } else
                if (error && callback) {
                    callback(error);
                    callback = false;
                }
            });
            c += 1;
            if (!waitForTracker[id]) {
                waitForTracker[id] = {};
            }
            waitForTracker[id][name] = "pending";
            process.nextTick(function() {
                worker.apply(null, args);
            });
        }
        var args = [];
        for (var i in arguments) {
            args.push(arguments[i]);
        }
        if (args.length === 0) {
            if (c === 0 && callback) {
                callback(error);
            }
        } else
        if (args.length === 1 && typeof args[0] === "string") {
            return function waitFor() {
                var args1 = [];
                for (var i in arguments) {
                    args1.push(arguments[i]);
                }
                runWorker(args[0], args1);
            }
        } else {
            runWorker(new Date().getTime(), args);
        }
    };    
}


exports.makeSerial = exports.makeSerialWaitFor = function(callback) {
    var id = new Date().getTime();
    var running = false;
    var queue = [];
    var error = undefined;
    return function waitFor() {
        function runOrQueueWorker(name, args) {
            if (running === false) {
                runWorker(name, args);
            }
            else {
                queue.push(function() {
                    runWorker(name, args);
                });
            }
        }
        function runWorker(name, args) {
            running = true;
            var worker = args.pop();
            args.push(function(cont) {
                waitForTracker[id][name] = "done";
                if (cont === false) {
                    queue = [];
                    running = false;
                    callback(error);
                } else
                if(typeof cont === "undefined" || cont === true || cont === null) {
                    if (queue.length > 0) {
                        queue.shift()();
                    } else {
                        running = false;
                        if(callback) callback(error);
                    }
                } else {
                    error = cont;
                    if (callback) {
                        callback(error);
                        callback = false;
                    }
                }
            });
            if (!waitForTracker[id]) {
                waitForTracker[id] = {};
            }
            waitForTracker[id][name] = "pending";
            process.nextTick(function() {
                worker.apply(null, args);
            });
        }
        var args = [];
        for (var i in arguments) {
            args.push(arguments[i]);
        }
        if (args.length === 0) {
            if (running === false && callback) {
                callback(error);
            }
        } else
        if (args.length === 1 && typeof args[0] === "string") {
            return function waitFor() {
                var args1 = [];
                for (var i in arguments) {
                    args1.push(arguments[i]);
                }
                runOrQueueWorker(args[0], args1);
            }
        } else {
            runOrQueueWorker(new Date().getTime(), args);
        }
    };    
}

