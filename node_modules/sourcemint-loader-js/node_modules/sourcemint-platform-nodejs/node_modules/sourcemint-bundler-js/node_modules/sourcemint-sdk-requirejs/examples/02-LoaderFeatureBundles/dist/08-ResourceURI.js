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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/main.js","fileMtime":1330459447000,"id":"/main.js"}
require.memoize("/main.js", 
define('',['require','exports','module','pkg/lib/from.txt'],function(require, exports, module)
{
    exports.main = function(options)
    {
        var deferred = require.API.Q.defer();

        
        var uri1 = require.nameToUrl("./hello.txt");

        if (uri1 !== (require.sandbox.id + require.id("./hello.txt")))
        {
            throw new Error("Resolved URIs do not match!");
        }
        
        
        // Link the sub-package so it is included in the bundle (because we just have a text file in it
        // and no modules that are linked elsewhere).
        require("pkg/lib/from.txt");
        // Now we can resolve a URI to it.
        var uri2 = require.nameToUrl("pkg/lib/from.txt")
        if (uri2 !== (require.sandbox.id + require.id("pkg/lib/from.txt")))
        {
            throw new Error("Resolved URIs do not match!");
        }


        require.API.JQUERY(function($)
        {
            $.get(uri1, function(data1)
            {
                $.get(uri2, function(data2)
                {
                    require.API.Q.call(function()
                    {
                        if (data1 !== "Hello")
                        {
                            throw new Error("Loaded resource does not have correct content!");
                        }
                        if (data2 !== "from")
                        {
                            throw new Error("Loaded resource does not have correct content!");
                        }
    
                        module.log(data1 + " " + data2 + " 08-ResourceURI!");
    
                    }).then(deferred.resolve, deferred.reject);
                });
            });
        });
        
        return deferred.promise;
    }
})
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package/lib/from.txt","fileMtime":0,"id":"181ec91403a48f3ff164272ef8b64c69548ad90f/lib/from.txt"}
require.memoize("181ec91403a48f3ff164272ef8b64c69548ad90f/lib/from.txt", 
"from"
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","mappings":{"pkg":"181ec91403a48f3ff164272ef8b64c69548ad90f"},"directories":{"lib":""}}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package/package.json","id":"181ec91403a48f3ff164272ef8b64c69548ad90f/package.json"}
require.memoize("181ec91403a48f3ff164272ef8b64c69548ad90f/package.json", 
{"directories":{"lib":"lib"},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/main.js":{"staticLinks":{"text!pkg/lib/from.txt":{"id":"pkg/lib/from.txt","treatAs":"text"}},"fileMtime":1330459447000,"treatAs":"js-module"}},"mappings":{"pkg":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package"}},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package/lib/from.txt":{"treatAs":"text"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/main.js":{"staticLinks":{"text!pkg/lib/from.txt":{"id":"pkg/lib/from.txt","treatAs":"text"}},"fileMtime":1330459447000,"treatAs":"js-module"}},"mappings":{"pkg":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package"}},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package/lib/from.txt":{"treatAs":"text"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/08-ResourceURI.js","packages":{"181ec91403a48f3ff164272ef8b64c69548ad90f":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/main.js","181ec91403a48f3ff164272ef8b64c69548ad90f/lib/from.txt":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/08-ResourceURI/sub-package/lib/from.txt"}}}
