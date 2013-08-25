// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js","fileMtime":1329946623000,"id":"/main.js"}
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
    
    	module.log("Hello from 09-LoadBundle!");
    
    	var extraModuleID = "./ExtraModule";
    
    	require.async(extraModuleID, function(EXTRA_MODULE)
    	{
    	    EXTRA_MODULE.init();
    
    		result.resolve();
    	});
    
    	return result.promise;
    }
    
    exports.getExtraModuleGreeting = function()
    {
    	return "Hello from 09-LoadBundle/ExtraModule!";
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js":{"staticLinks":{},"dynamicLinks":{"extraModuleID":"extraModuleID"},"fileMtime":1329946623000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js":{"staticLinks":{},"dynamicLinks":{"extraModuleID":"extraModuleID"},"fileMtime":1329946623000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/03-LoaderFeatureBundles/dist/09-LoadBundle.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js"}}}
