// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/ExtraModule.js","fileMtime":1329946591000,"id":"/ExtraModule.js"}
require.memoize("/ExtraModule.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/ExtraModule.js";
    var __dirname = require.sandbox.id + "";
    
    var MAIN = require("./main.js");
    
    exports.init = function()
    {
    	module.log(MAIN.getExtraModuleGreeting());
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/ExtraModule.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/ExtraModule.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/ExtraModule.js":{"staticLinks":{"./main.js":"./main.js"},"dynamicLinks":{},"fileMtime":1329946591000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js":{"staticLinks":{},"dynamicLinks":{"extraModuleID":"extraModuleID"},"fileMtime":1329946623000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/ExtraModule.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/ExtraModule.js":{"staticLinks":{"./main.js":"./main.js"},"dynamicLinks":{},"fileMtime":1329946591000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/main.js":{"staticLinks":{},"dynamicLinks":{"extraModuleID":"extraModuleID"},"fileMtime":1329946623000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/02-BundlerMiddleware/dist/09-LoadBundle/ExtraModule.js","packages":{},"modules":{"/ExtraModule.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/09-LoadBundle/ExtraModule.js"}}}
