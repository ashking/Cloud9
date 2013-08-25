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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/main.js","fileMtime":1329942671000,"id":"/main.js"}
require.memoize("/main.js", 
define('',['require','exports','module'],function(require, exports, module)
{
    var Q;
    
    exports.main = function(options)
    {
    	Q = require.API.Q;
    
    	module.log("Hello from 11-CrossDomain!");
    
        return Q.all([
    		"https://raw.github.com/sourcemint/loader-js/master/examples/11-CrossDomain/CrossDomainBundle.js",
    		// TODO: Point to `http://sourcemint.com/` URL
    		"http://static.cadorn.net/CrossDomainBundle.js"
    	].map(function(url) {
    		var result = Q.defer();
    
    		require.sandbox(url, function(sandbox)
    		{
    			sandbox.main();
    
    			result.resolve();
    		}, {
    			onInitModule: function(moduleInterface, moduleObj)
    			{
    				moduleInterface.log = function()
    				{
    					module.logForModule(moduleObj, arguments);
    				}
    			}
    		});
    
    		return result.promise;
        }));
    }
})
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/main.js":{"staticLinks":{},"fileMtime":1329942671000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/main.js":{"staticLinks":{},"fileMtime":1329942671000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/02-LoaderFeatureBundles/dist/11-CrossDomain.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/11-CrossDomain/main.js"}}}
