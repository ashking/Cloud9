// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/sub-module.js","fileMtime":1330717961000,"id":"/sub-module.js"}
require.memoize("/sub-module.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/sub-module.js";
    var __dirname = require.sandbox.id + "";
    
    exports.main = function()
    {
        postMessage({type: "log", data: "Hello from Worker-Package Sub-Module!"});
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/sub-module.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/sub-module.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/sub-module.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1330717961000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/sub-module.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/sub-module.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1330717961000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/dist/worker-package/sub-module.js","packages":{},"modules":{"/sub-module.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/03-BundlerMiddlewareBundleLoader/worker-package/sub-module.js"}}}
