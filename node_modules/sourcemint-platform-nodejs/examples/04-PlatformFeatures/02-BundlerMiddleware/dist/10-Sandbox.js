// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/main.js","fileMtime":1329118874000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    var Q;
    
    exports.main = function(options)
    {
    	Q = require.API.Q;
    	
    	var result = Q.defer();
    
    	module.log("Hello from 10-Sandbox!");
    
    	var url = require.sandbox.id + require.id("./SandboxedExtraBundle");
    
    	require.sandbox(url, function(sandbox)
    	{
    		sandbox.main();
    
    		result.resolve();
    	}, {
    		onInitModule: function(moduleInterface, moduleObj)
    		{
    			moduleInterface.log = function()
    			{
    				module.logForModule(moduleObj, arguments);
    			}
    		}
    	});
    
    	return result.promise;
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/main.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329118874000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/main.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329118874000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/02-BundlerMiddleware/dist/10-Sandbox.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/main.js"}}}
