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
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/main.js","fileMtime":1329943014000,"id":"/main.js"}
require.memoize("/main.js", 
define('',['require','exports','module'],function(require, exports, module)
{
    exports.main = function(options)
    {			
    	module.log("Hello from 12-Environment!");
    	
    	if (module.id !== "/main.js")
    	{
    		throw new Error("`module.id` has incorrect value!");
    	}
    	
    	if (typeof require !== "function")
    	{
    		throw new Error("`require` is not a function!");
    	}
    
    	if (typeof require.id !== "function")
    	{
    		throw new Error("`require.id` is not a function!");
    	}
    
    	if (typeof require.async !== "function")
    	{
    		throw new Error("`require.async` is not a function!");
    	}
    
    	if (typeof require.sandbox !== "function")
    	{
    		throw new Error("`require.sandbox` is not a function!");
    	}
    	
    	if (typeof require.sandbox.id !== "string")
    	{
    		throw new Error("`require.sandbox.id` is not a string!");
    	}
    }
})
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/main.js":{"staticLinks":{},"fileMtime":1329943014000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment","packages":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/main.js":{"staticLinks":{},"fileMtime":1329943014000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/03-SDKFeatures/01-BundlerMiddleware/dist/12-Environment.js","packages":{},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/sdk-requirejs/0/examples/01-LoaderFeatures/12-Environment/main.js"}}}
