var http = require("http");
process.stdin.resume();

var collectedData = {};
var dataAge = {};

function onReceiveProbe(system, json) {
    collectedData[system] = json;
    dataAge[system] = Date.now();
    //console.log(system, json);
}

var buffer = '';
process.stdin.on("data", function(data) {
    buffer += data.toString();
    
    buffer = buffer.replace(/\[\[\[\[\[\[\s*(\S+)\s+(.+?)\]\]\]\]\]\]/g, function(m, system, jsonS) {
        try {
            var json = JSON.parse(jsonS);
            onReceiveProbe(system, json);
        } catch(e) {
            console.log("Wrong packet:", e, e.message, buffer);
        }
        return "";
    });
});

function htmlify(s) {
    return s.replace(/</g, "&lt;").replace(/\t/g, "&nbsp;&nbsp;").replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;");
}

function probeJsonToHtml(results) {
    var html = '<table width="100%">';
    var probes = Object.keys(results).sort();
    probes.forEach(function(probeName) {
        var result = results[probeName];
        html += '<tr><td width="200" valign="top">' + probeName + '</td><td width="*" style="background-color: '+ (result.err ? "#EA5454" : "#55C149") + '"><code>';
        html += htmlify(result.err || JSON.stringify(result.r, null, 2));
        html += '</code></td></tr>';
    });
    html += '</table>';
    return html;
}

function aggregateProxies(data) {
    var all = {};
    if(!data["proxy/master"]) // data did not come in yet
        return data;
    dataAge["proxy"] = dataAge["proxy/master"];
    var aggregateData = {
        "Handover": data["proxy/master"]["Handover"],
        "IDE Servers": data["proxy/master"]["IDE Servers"],
        "Workspace count": data["proxy/master"]["Workspace count"],
        "Requests": {err: null, r: 0},
        "WS Requests": {err: null, r: 0},
    };
    for(var server in data) {
        if(server.indexOf("proxy/") !== 0)
            all[server] = data[server];
        else {
            aggregateData["Requests"].r += data[server]["Requests"].r;
            aggregateData["WS Requests"].r += data[server]["WS Requests"].r;
        }
    }
    all.proxy = aggregateData;
    return all;
}

http.createServer(function(req, res) {
    var aggregateData = aggregateProxies(collectedData);
    if(req.url === "/json") {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify(aggregateData, null, 2));
        return;
    }
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<html><head><title>C9 monitor</title></head><body>");
    var keys = Object.keys(aggregateData).sort();
    keys.forEach(function(key) {
        res.write("<h1>" + key + "</h1>Updated: " + ((Date.now() - dataAge[key])/1000) + "s ago<br/>");
        res.write(probeJsonToHtml(aggregateData[key]));
    });
    res.end("</body></html>");
}).listen(4445, "0.0.0.0");

console.log("Listening on port 4445");