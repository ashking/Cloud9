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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/main.js","fileMtime":1329945722000,"id":"/main.js"}
require.memoize("/main.js", 
// @see http://requirejs.org/docs/api.html#defdep

define('',["module", "./word"], function(module, WORD)
{
    return {
        main: function(options)
        {
            module.log(WORD.word + " from 99-03-DefinitionFunctionsWithDependencies!");
        }
    };
})
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/word.js","fileMtime":1329944746000,"id":"/word.js"}
require.memoize("/word.js", 
define('',[],function()
{
    return {
        word: "Hello"
    };
})
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/main.js":{"staticLinks":{"./word":"./word"},"fileMtime":1329945722000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/word.js":{"staticLinks":{},"fileMtime":1329944746000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/main.js":{"staticLinks":{"./word":"./word"},"fileMtime":1329945722000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/word.js":{"staticLinks":{},"fileMtime":1329944746000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/99-03-DefinitionFunctionsWithDependencies.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/main.js","/word.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-03-DefinitionFunctionsWithDependencies/word.js"}}}
