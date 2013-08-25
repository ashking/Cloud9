// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/main.js","fileMtime":1329109242000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    // One-way dependency.
    var GREETINGS = require("helpers/greetings"),
    	LOGGER = require("helpers/logger");
    
    exports.main = function(options)
    {
    	LOGGER.log(GREETINGS.getGreeting());
    }
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js","fileMtime":1329112860000,"id":"c8fdbfb58ba344e241f350f4db644a5ca402b3bb/greetings.js"}
require.memoize("c8fdbfb58ba344e241f350f4db644a5ca402b3bb/greetings.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "c8fdbfb58ba344e241f350f4db644a5ca402b3bb/greetings.js";
    var __dirname = require.sandbox.id + "/c8fdbfb58ba344e241f350f4db644a5ca402b3bb";
    
    var HELLO = require("package/hello");
    
    exports.getGreeting = function()
    {
    	return HELLO.getWord() + " from " + HELLO.getName() + "!";
    }
    
    exports.getName = function()
    {
    	return "05-CrossPackageDependencies";
    }
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js","fileMtime":1329109140000,"id":"c8fdbfb58ba344e241f350f4db644a5ca402b3bb/logger.js"}
require.memoize("c8fdbfb58ba344e241f350f4db644a5ca402b3bb/logger.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "c8fdbfb58ba344e241f350f4db644a5ca402b3bb/logger.js";
    var __dirname = require.sandbox.id + "/c8fdbfb58ba344e241f350f4db644a5ca402b3bb";
    
    exports.log = function(message)
    {
    	module.log(message);
    }
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js","fileMtime":1329109182000,"id":"8006e010fb60da2be1a5ad691d389c8a3146127e/words/hello.js"}
require.memoize("8006e010fb60da2be1a5ad691d389c8a3146127e/words/hello.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "8006e010fb60da2be1a5ad691d389c8a3146127e/words/hello.js";
    var __dirname = require.sandbox.id + "/8006e010fb60da2be1a5ad691d389c8a3146127e/words";
    
    var GREETINGS = require("package/greetings");
    
    exports.getWord = function()
    {
    	return require("letters/H").getLetter() + "ello";
    }
    
    exports.getName = function()
    {
    	return GREETINGS.getName();
    }
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js","fileMtime":1329109235000,"id":"91dc444cfecc833c728374ac4dc405a612d304f0/H.js"}
require.memoize("91dc444cfecc833c728374ac4dc405a612d304f0/H.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "91dc444cfecc833c728374ac4dc405a612d304f0/H.js";
    var __dirname = require.sandbox.id + "/91dc444cfecc833c728374ac4dc405a612d304f0";
    
    exports.getLetter = function()
    {
        return "H";
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","mappings":{"helpers":"c8fdbfb58ba344e241f350f4db644a5ca402b3bb"},"directories":{"lib":""}}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/package.json","id":"c8fdbfb58ba344e241f350f4db644a5ca402b3bb/package.json"}
require.memoize("c8fdbfb58ba344e241f350f4db644a5ca402b3bb/package.json", 
{"mappings":{"package":"8006e010fb60da2be1a5ad691d389c8a3146127e"},"directories":{"lib":""}}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/package.json","id":"8006e010fb60da2be1a5ad691d389c8a3146127e/package.json"}
require.memoize("8006e010fb60da2be1a5ad691d389c8a3146127e/package.json", 
{"mappings":{"package":"c8fdbfb58ba344e241f350f4db644a5ca402b3bb","letters":"91dc444cfecc833c728374ac4dc405a612d304f0"},"directories":{"lib":"words"}}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/package.json","id":"91dc444cfecc833c728374ac4dc405a612d304f0/package.json"}
require.memoize("91dc444cfecc833c728374ac4dc405a612d304f0/package.json", 
{"directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/main.js":{"staticLinks":{"helpers/greetings":"helpers/greetings","helpers/logger":"helpers/logger"},"dynamicLinks":{},"fileMtime":1329109242000,"treatAs":"js-module"}},"mappings":{"helpers":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js":{"staticLinks":{"package/hello":"package/hello"},"dynamicLinks":{},"fileMtime":1329112860000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109140000,"treatAs":"js-module"}},"mappings":{"package":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js":{"staticLinks":{"package/greetings":"package/greetings","letters/H":"letters/H"},"dynamicLinks":{},"fileMtime":1329109182000,"treatAs":"js-module"}},"mappings":{"package":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA","letters":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109235000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/main.js":{"staticLinks":{"helpers/greetings":"helpers/greetings","helpers/logger":"helpers/logger"},"dynamicLinks":{},"fileMtime":1329109242000,"treatAs":"js-module"}},"mappings":{"helpers":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js":{"staticLinks":{"package/hello":"package/hello"},"dynamicLinks":{},"fileMtime":1329112860000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109140000,"treatAs":"js-module"}},"mappings":{"package":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js":{"staticLinks":{"package/greetings":"package/greetings","letters/H":"letters/H"},"dynamicLinks":{},"fileMtime":1329109182000,"treatAs":"js-module"}},"mappings":{"package":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA","letters":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC":{"mainModule":{},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109235000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/03-LoaderFeatureBundles/dist/05-CrossPackageDependencies.js","packages":{"c8fdbfb58ba344e241f350f4db644a5ca402b3bb":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA","8006e010fb60da2be1a5ad691d389c8a3146127e":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB","91dc444cfecc833c728374ac4dc405a612d304f0":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/main.js","c8fdbfb58ba344e241f350f4db644a5ca402b3bb/greetings.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js","c8fdbfb58ba344e241f350f4db644a5ca402b3bb/logger.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js","8006e010fb60da2be1a5ad691d389c8a3146127e/words/hello.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js","91dc444cfecc833c728374ac4dc405a612d304f0/H.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js"}}}
