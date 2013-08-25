// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/SandboxedExtraBundle.js","fileMtime":1329118927000,"id":"/SandboxedExtraBundle.js"}
require.memoize("/SandboxedExtraBundle.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/SandboxedExtraBundle.js";
    var __dirname = require.sandbox.id + "";
    
    exports.main = function(options)
    {
    	module.log("Hello from 10-Sandbox/SandboxedExtraBundle!");
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/SandboxedExtraBundle.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/SandboxedExtraBundle.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/SandboxedExtraBundle.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329118927000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/SandboxedExtraBundle.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/SandboxedExtraBundle.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329118927000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/03-LoaderFeatureBundles/dist/10-Sandbox/SandboxedExtraBundle.js","packages":{},"modules":{"/SandboxedExtraBundle.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/10-Sandbox/SandboxedExtraBundle.js"}}}
