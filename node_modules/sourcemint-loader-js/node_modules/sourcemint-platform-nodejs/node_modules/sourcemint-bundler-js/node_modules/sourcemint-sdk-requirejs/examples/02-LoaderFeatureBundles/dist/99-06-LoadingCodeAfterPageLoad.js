// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}
function define(id, dependencies, moduleInitializer)
{
    return function(require, exports, module) {
        if (typeof moduleInitializer === "function") {
            return moduleInitializer.apply(moduleInitializer, dependencies.map(function(name) {
                if (name === "require") return require;
                if (name === "exports") return exports;
                if (name === "module") return module;
                return require(name);
            }))
        } else
        if (typeof dependencies === "object") {
            return dependencies;
        }
    }
}
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/main.js","fileMtime":1330468229000,"id":"/main.js"}
require.memoize("/main.js", 
// @see http://requirejs.org/docs/api.html#afterload

define('',['require','exports','module'],function(require, exports, module)
{
    var Q;

    exports.main = function(options)
    {
        Q = require.API.Q;
        
        var result = Q.defer();

        module.log("Hello from 99-06-LoadingCodeAfterPageLoad!");

        var extraModuleID = "./ExtraModule";

        require([extraModuleID], function(EXTRA_MODULE)
        {
            EXTRA_MODULE.init().then(result.resolve, result.reject);
        });

        return result.promise;
    }

    exports.getExtraModuleGreeting = function()
    {
        var result = Q.defer();

        var extraModuleID = "pkg/hello";

        require([extraModuleID], function(EXTRA_MODULE)
        {
            result.resolve(EXTRA_MODULE.getHello() + " from 99-06-LoadingCodeAfterPageLoad/ExtraModule!");
        });

        return result.promise;
    }
})
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","mappings":{"pkg":"3c7dbbd30c96a38dbd6177f955eebe9f7365b427"},"directories":{"lib":""}}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/sub-package/package.json","id":"3c7dbbd30c96a38dbd6177f955eebe9f7365b427/package.json"}
require.memoize("3c7dbbd30c96a38dbd6177f955eebe9f7365b427/package.json", 
{"directories":{"lib":"lib"},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/main.js":{"staticLinks":{},"fileMtime":1330468229000,"treatAs":"js-module"}},"mappings":{"pkg":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/sub-package"}},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/sub-package":{"mainModule":{},"modules":{},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/main.js":{"staticLinks":{},"fileMtime":1330468229000,"treatAs":"js-module"}},"mappings":{"pkg":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/sub-package"}},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/sub-package":{"mainModule":{},"modules":{},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/99-06-LoadingCodeAfterPageLoad.js","packages":{"3c7dbbd30c96a38dbd6177f955eebe9f7365b427":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/sub-package"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-06-LoadingCodeAfterPageLoad/main.js"}}}
