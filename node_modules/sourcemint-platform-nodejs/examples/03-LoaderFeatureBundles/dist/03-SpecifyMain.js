// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/init.js","fileMtime":1329097796000,"id":"/init.js"}
require.memoize("/init.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/init.js";
    var __dirname = require.sandbox.id + "";
    
    exports.main = function(options)
    {
    	module.log("Hello from 03-SpecifyMain!");
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/init.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/init.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/init.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329097796000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/init.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/init.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329097796000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/03-LoaderFeatureBundles/dist/03-SpecifyMain.js","packages":{},"modules":{"/init.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/03-SpecifyMain/init.js"}}}
