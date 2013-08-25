var fs = require("fs");
var Dgram = require("dgram");
var spawn = require("child_process").spawn;

var port = 4444;
var host = "0.0.0.0";

var server = Dgram.createSocket("udp4");

var monitorScript = __dirname + "/monitor.js";
var monitor;

fs.watchFile(monitorScript, function(oldStat, newStat) {
    if(oldStat.mtime.getTime() === newStat.mtime.getTime())
        return;
    monitor.kill("SIGKILL");
    console.log("Restarting the monitor script");
    //startMonitor();
});

function startMonitor() {
    monitor = spawn("node", [monitorScript]);
    
    monitor.stdout.on("data", function(data) {
        process.stdout.write(data.toString());
    });
    monitor.stderr.on("data", function(data) {
        process.stdout.write(data.toString());
    });
    monitor.on("exit", startMonitor);
}

startMonitor();

server.on("message", function(msg, rinfo) {
    try {
        monitor.stdin.write(msg);
    } catch(e) {
        console.error("Could not write to monitor:", e.message);
    }
});

function kill() {
    monitor.kill("SIGKILL");
    console.log("BYE");
    process.exit(0);
}
process.on("SIGINT", kill);
process.on("SIGKILL", kill);
process.on("SIGTERM", kill);

server.bind(port, host);