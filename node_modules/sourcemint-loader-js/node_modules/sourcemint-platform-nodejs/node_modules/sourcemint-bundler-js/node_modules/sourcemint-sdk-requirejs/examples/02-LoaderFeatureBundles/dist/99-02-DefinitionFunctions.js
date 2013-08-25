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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/main.js","fileMtime":1329945712000,"id":"/main.js"}
require.memoize("/main.js", 
// @see http://requirejs.org/docs/api.html#deffunc

define('',['require','exports','module','./word'],function(require, exports, module)
{
    var WORD = require("./word").word;

    exports.main = function(options)
    {
        module.log(WORD + " from 99-02-DefinitionFunctions!");
    }
})
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/word.js","fileMtime":1329944746000,"id":"/word.js"}
require.memoize("/word.js", 
define('',[],function()
{
    return {
        word: "Hello"
    };
})
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/main.js":{"staticLinks":{"./word":"./word"},"fileMtime":1329945712000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/word.js":{"staticLinks":{},"fileMtime":1329944746000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/main.js":{"staticLinks":{"./word":"./word"},"fileMtime":1329945712000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/word.js":{"staticLinks":{},"fileMtime":1329944746000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/99-02-DefinitionFunctions.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/main.js","/word.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/99-02-DefinitionFunctions/word.js"}}}
