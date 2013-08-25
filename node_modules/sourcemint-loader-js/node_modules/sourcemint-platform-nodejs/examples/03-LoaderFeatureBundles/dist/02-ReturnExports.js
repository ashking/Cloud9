// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/main.js","fileMtime":1329616531000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    return {
    	main: function(options)
    	{
    		module.log("Hello from 02-ReturnExports!");
    	}
    };
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/main.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329616531000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/main.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329616531000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/03-LoaderFeatureBundles/dist/02-ReturnExports.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/02-ReturnExports/main.js"}}}
