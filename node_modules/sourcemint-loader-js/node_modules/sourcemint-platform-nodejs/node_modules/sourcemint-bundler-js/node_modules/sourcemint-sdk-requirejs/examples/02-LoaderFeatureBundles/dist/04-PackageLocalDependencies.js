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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/main.js","fileMtime":1328844539000,"id":"/main.js"}
require.memoize("/main.js", 
define('',['require','exports','module','./greetings'],function(require, exports, module)
{
	// One-way dependency.
	var GREETINGS = require("./greetings");

	exports.main = function(options)
	{
		module.log(GREETINGS.getGreeting());
	};
})
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/greetings.js","fileMtime":1328862871000,"id":"/greetings.js"}
require.memoize("/greetings.js", 
define('',['require','exports','module','./words/hello'],function(require, exports, module)
{
	// Circular dependency.
	var HELLO = require("./words/hello");

	exports.getGreeting = function()
	{
		return HELLO.getWord() + " from " + HELLO.getName() + "!";
	}

	exports.getName = function()
	{
		return "04-PackageLocalDependencies";
	}
})
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/words/hello.js","fileMtime":1328862268000,"id":"/words/hello.js"}
require.memoize("/words/hello.js", 
define('',['require','exports','module','../greetings'],function(require, exports, module)
{
	// Circular dependency.
	var GREETINGS = require("../greetings");

	exports.getWord = function()
	{
		return "Hello";
	}

	exports.getName = function()
	{
		return GREETINGS.getName();
	}
})
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/main.js":{"staticLinks":{"./greetings":"./greetings"},"fileMtime":1328844539000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/greetings.js":{"staticLinks":{"./words/hello":"./words/hello"},"fileMtime":1328862871000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/words/hello.js":{"staticLinks":{"../greetings":"../greetings"},"fileMtime":1328862268000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/main.js":{"staticLinks":{"./greetings":"./greetings"},"fileMtime":1328844539000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/greetings.js":{"staticLinks":{"./words/hello":"./words/hello"},"fileMtime":1328862871000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/words/hello.js":{"staticLinks":{"../greetings":"../greetings"},"fileMtime":1328862268000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/04-PackageLocalDependencies.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/main.js","/greetings.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/greetings.js","/words/hello.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/04-PackageLocalDependencies/words/hello.js"}}}
