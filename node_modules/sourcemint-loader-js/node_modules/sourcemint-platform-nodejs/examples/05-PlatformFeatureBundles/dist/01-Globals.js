// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/main.js","fileMtime":1329438299000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    exports.main = function()
    {
    	if (typeof global === "undefined")
    	{
    		throw new Error("The 'global' global variable should be defined!");
    	}
    
    	if (typeof process === "undefined")
    	{
    		throw new Error("The 'process' global variable should be defined!");
    	}
    	
    	if (typeof Buffer === "undefined")
    	{
    		throw new Error("The 'Buffer' global variable should be defined!");
    	}
    
    	
    	if (typeof setTimeout === "undefined")
    	{
    		throw new Error("The 'setTimeout' global variable should be defined!");
    	}
    	
    	if (typeof clearTimeout === "undefined")
    	{
    		throw new Error("The 'clearTimeout' global variable should be defined!");
    	}
    
    	if (typeof setInterval === "undefined")
    	{
    		throw new Error("The 'setInterval' global variable should be defined!");
    	}
    
    	if (typeof clearInterval === "undefined")
    	{
    		throw new Error("The 'clearInterval' global variable should be defined!");
    	}
    
    	
    	if (typeof require.resolve !== "function")
    	{
    		throw new Error("'require.resolve' on the global 'require' variable should be a function!");
    	}
    	
    	
    	if (typeof __filename === "undefined")
    	{
    		throw new Error("The '__filename' global variable should be defined!");
    	}
    	
    	// TODO: Detect running mode and insist on test if running in sourcemint loader.
    	if (typeof require.sandbox !== "undefined")
    	{
    		if (__filename !== (require.sandbox.id + module.id))
    		{
    			throw new Error("The '__filename' global does not equal the value of 'require.sandbox.id + module.id'!");
    		}
    	}
    	
    	if (typeof __dirname === "undefined")
    	{
    		throw new Error("The '__dirname' global variable should be defined!");
    	}
    
    	// TODO: Detect running mode and insist on test if running in sourcemint loader.
    	if (typeof require.sandbox !== "undefined")
    	{
    		if (__dirname !== (require.sandbox.id + module.id).replace(/\/([^\/]*)$/,""))
    		{
    			throw new Error("The '__dirname' global does not equal the value of 'PATH.dirname(require.sandbox.id + module.id)'!");
    		}
    	}
    	
    	console.log("01-Globals OK");
    }
    
    
    if (require.main === module) {
    	exports.main();
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"private":true,"name":"sourcemint-platform-nodejs-examples-04-PlatformFeatures-01-Globals","version":"0.1.0","engines":{"nodejs":"0.x"},"scripts":{"test":"node main"},"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/main.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329438299000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/main.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329438299000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/05-PlatformFeatureBundles/dist/01-Globals.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/01-Globals/main.js"}}}
