// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/lib.js","fileMtime":1329437415000,"id":"/lib.js"}
require.memoize("/lib.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/lib.js";
    var __dirname = require.sandbox.id + "";
    
    exports.main = function()
    {
    	return "Hello from Avoid-VariableRequire!";
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/lib.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/lib.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/lib.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329437415000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/lib.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/lib.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329437415000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/03-LoaderFeatureBundles/dist/Avoid-VariableRequire/lib.js","packages":{},"modules":{"/lib.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/Avoid-VariableRequire/lib.js"}}}
