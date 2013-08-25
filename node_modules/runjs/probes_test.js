var assert = require("assert");
var asyncjs = require("asyncjs");
var probes = require("./probes");

probes.define("test/latency", 500, function(callback) {
    setTimeout(function() {
        callback(null, {name: "Test"});
    }, 100);
});

probes.define("test/fail", 500, function(callback) {
    callback("fail");
});

probes.define("test/slow", 20000, function(callback) {
    setTimeout(function() {
        callback(null, "ok");
    }, 2000);
});

probes.define("test/no-response", 500, function(callback) {
});

module.exports = {
    "test probes" : function(next) {
        var hitSecond = false;
        probes.probeAll(1000, function(err, result) {
            console.log(result);
            assert.equal(err, null, "no error");
            assert.equal(result["test/fail"].err, "fail", "fail test");
            assert.equal(result["test/latency"].result.name, "Test", "json result test");
            assert.equal(result["test/slow"].err, "Probe timed out", "timeout test");
            assert.equal(result["test/no-response"].err, "Probe timed out", "no callback test");
            assert.ok(hitSecond, "other probes triggered already");
            next();
        });
        setTimeout(function() {
            probes.probeAll(1000, function(err, result) {
                assert.equal(Object.keys(result).length, 0, "no probes executed, second time");
                hitSecond = true;
            });
        }, 10);
    },
}

!module.parent && asyncjs.test.testcase(module.exports, "Helper").exec();