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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/main.js","fileMtime":1330390053000,"id":"/main.js"}
require.memoize("/main.js", 
define('',['require','exports','module','./hello.js','./hello.txt'],function(require, exports, module)
{
    var TEXT1 = require("./hello.js"),
        TEXT2 = require("./hello.txt");

    exports.main = function(options)
    {
        var TEXT = TEXT1 + TEXT2.replace(" \\ \" 0 - _ . ! ~ * ' ( ) ; , / ? : @ & = + $", "");

        if (TEXT.length != 5)
        {
            throw new Error("Text was not decoded properly!");
        }

        module.log(TEXT + " from 07-TextModule!");
    }
})
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.js","fileMtime":0,"id":"/hello.js"}
require.memoize("/hello.js", 
"Hello"
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.txt","fileMtime":0,"id":"/hello.txt"}
require.memoize("/hello.txt", 
"%20%5C%20%22%200%20-%20_%20.%20!%20~%20*%20'%20(%20)%20%3B%20%2C%20%2F%20%3F%20%3A%20%40%20%26%20%3D%20%2B%20%24"
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/main.js":{"staticLinks":{"text!./hello.js":{"id":"./hello.js","treatAs":"text"},"text!./hello.txt":{"id":"./hello.txt","treatAs":"text"}},"fileMtime":1330390053000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.js":{"treatAs":"text"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.txt":{"treatAs":"text"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/main.js":{"staticLinks":{"text!./hello.js":{"id":"./hello.js","treatAs":"text"},"text!./hello.txt":{"id":"./hello.txt","treatAs":"text"}},"fileMtime":1330390053000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.js":{"treatAs":"text"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.txt":{"treatAs":"text"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/07-TextModule.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/main.js","/hello.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.js","/hello.txt":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/07-TextModule/hello.txt"}}}
