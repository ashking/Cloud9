// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/main.js","fileMtime":1329087684000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    // One-way dependency.
    var GREETINGS = require("./greetings");
    
    exports.main = function(options)
    {
    	module.log(GREETINGS.getGreeting());
    };
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/greetings.js","fileMtime":1329087055000,"id":"/greetings.js"}
require.memoize("/greetings.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/greetings.js";
    var __dirname = require.sandbox.id + "";
    
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
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/words/hello.js","fileMtime":1329086855000,"id":"/words/hello.js"}
require.memoize("/words/hello.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/words/hello.js";
    var __dirname = require.sandbox.id + "/words";
    
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
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/main.js":{"staticLinks":{"./greetings":"./greetings"},"dynamicLinks":{},"fileMtime":1329087684000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/greetings.js":{"staticLinks":{"./words/hello":"./words/hello"},"dynamicLinks":{},"fileMtime":1329087055000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/words/hello.js":{"staticLinks":{"../greetings":"../greetings"},"dynamicLinks":{},"fileMtime":1329086855000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/main.js":{"staticLinks":{"./greetings":"./greetings"},"dynamicLinks":{},"fileMtime":1329087684000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/greetings.js":{"staticLinks":{"./words/hello":"./words/hello"},"dynamicLinks":{},"fileMtime":1329087055000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/words/hello.js":{"staticLinks":{"../greetings":"../greetings"},"dynamicLinks":{},"fileMtime":1329086855000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/04-PlatformFeatures/02-BundlerMiddleware/dist/04-PackageLocalDependencies.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/main.js","/greetings.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/greetings.js","/words/hello.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/04-PackageLocalDependencies/words/hello.js"}}}
