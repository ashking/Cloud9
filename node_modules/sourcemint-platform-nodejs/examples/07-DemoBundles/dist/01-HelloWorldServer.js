// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js","fileMtime":1329241551000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    var HTTP = require("__nodejs__/http");
    
    
    exports.main = function(onReadyDeferred, options)
    {
    	var server = HTTP.createServer();
    
    	server.on("request", function (req, res)
    	{
    	    res.writeHead(200, {
    	    	"Content-Type": "text/plain"
    	    });
    	    res.end("Hello from 01-HelloWorldServer");
    	});
    
    	/*TEST*/ if (onReadyDeferred) {
    	/*TEST*/     server.once("listening", function() {
    	/*TEST*/         onReadyDeferred.resolve(function onTestDone(stoppedCallback) {
    	/*TEST*/ 		     server.once("close", function() {
    	/*TEST*/ 			     stoppedCallback();
    	/*TEST*/ 		     });
    	/*TEST*/ 		     server.close();
    	/*TEST*/ 	     });
    	/*TEST*/     });
    	/*TEST*/ }
    
    	server.listen(options.port, "127.0.0.1");
    
    	console.log("Server running at http://127.0.0.1:" + options.port + "/");
    }
    
    if (require.main === module) {
    	exports.main(null, {
    		port: 1337
    	});
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"private":true,"name":"sourcemint-platform-nodejs-examples-06-Demos-01-HelloWorldServer","version":"0.1.0","engines":{"nodejs":"0.x"},"scripts":{"test":"node test"},"main":"/main.js","directories":{"lib":""},"mappings":{"__nodejs__":"__nodejs.org/0__"}}
);
// @sourcemint-bundle-descriptor: {"file":"nodejs.org/0/package.json","id":"043956adb8f7b26566da4cdc0e2ca286566dc494/package.json"}
require.memoize("043956adb8f7b26566da4cdc0e2ca286566dc494/package.json", 
{"directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1329241551000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1329241551000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/07-DemoBundles/dist/01-HelloWorldServer.js","packages":{"043956adb8f7b26566da4cdc0e2ca286566dc494":"nodejs.org/0"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js"}}}
