/**
 * Copyright: 2012 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

// TODO: Get this working in a portable way without relying on `r.js` running on NodeJS.
//	     We can do this by writing an adapter for `r.js` like it has for Java using `sourcemint/stdlib-js` once implemented.

var FS = require("fs"),
	PATH = require("path"),
	Q = require("q"),
	REQUIREJS = require("requirejs"),
	BUNDLER = require("sourcemint-platform-nodejs/lib/bundler");


// TODO: Use helper function from bundler where possible.

REQUIREJS.config({
    nodeRequire: require,
	baseUrl: FS.realpathSync(__dirname + "/../packages/github.com/jrburke/r.js/1/build/jslib"),
});


exports.bundle = BUNDLER.bundle;


// TODO: Inherit from bundle adapter object which can do this for all adapters.
var cache = {
        parseModule: {}
    };


exports.parseModule = function(path, options)
{
	var deferred = Q.defer();

	Q.call(function()
	{
		var report = {};

        if (options.treatAs === "js-module")
        {
            REQUIREJS(["parse"], function(PARSE)
            {
                var stats = FS.statSync(path);

                if (!cache.parseModule[path]) {
                    cache.parseModule[path] = {};
                }
                if (cache.parseModule[path].mtime !== stats.mtime.toString())
                {
                    cache.parseModule[path].mtime = stats.mtime.toString();
                    
                    var code = FS.readFileSync(path).toString();
                    
                    cache.parseModule[path].links = PARSE.findDependencies(path, code);
                }

                recordLinks(cache.parseModule[path].links);
                
                function recordLinks(links)
                {
                    report.staticLinks = {};
                    
                    // TODO: Look for `require([])` separately. At the moment they get included below creating
                    //       a static link were we should really be creating a dynamic link.
                    
                    links.filter(function(name)
                    {
                        // We don't care about the CommonJS dependencies at this point.
                        if (name === "require" || name === "exports" || name === "module") return false;

                        // Look for certain plugin prefixes and remove.
                        var m;
                        if ((m = name.match(/^([^!]*)!(.*)$/)))
                        {
                            if (m[1] === "text" ||
                                // HACK to get around: https://github.com/ajaxorg/ace/blob/88fe36238449f1b74b2014965a4ea408fcee6392/demo/kitchen-sink/demo.js#L136
                                // TODO: Relocate to a bundler plugin that resides with the ACE project.
                                m[1] === "ace/requirejs/text")
                            {
                                report.staticLinks[name] = {
                                    "id": m[2],
                                    // NOTE: By specifying how this module should be treated we instruct the bundler
                                    //       on how to store the module for ALL consumers. If two modules reference
                                    //       this same module once as a JS module and once as a text module whichever
                                    //       link was last found will determine how module will be treated. This most
                                    //       likely will break the application and should be avoided.
                                    //       If you don't require files ending with `.js` using `require("text!*.js")`
                                    //       this will never be a problem for you.
                                    "treatAs": "text"
                                }
                            }
                            else
                            {
                                throw new Error("The '" + m[1] + "' RequireJS plugin is not supported!");
                            }
                        }
                        else
                        {
                            report.staticLinks[name] = name;
                        }
                        return true;
                    });
                }
            });
        }

        deferred.resolve(report);

	}).fail(function(err)
	{
        err.stack = "Error '" + err.message + "' while parsing module: " + path + "\n" + err.stack;
        deferred.reject(err);
    });

	return deferred.promise;
}


exports.resolveUri = function(uri)
{
	return Q.call(function()
	{
        if (PATH.existsSync(uri + ".js"))
        {
            return FS.realpathSync(uri + ".js");
        }
		else
        if (PATH.existsSync(uri))
        {
            return FS.realpathSync(uri);
        }
		else
		{
			throw new Error("Could not find file at path: " + uri);
		}
	});
}


exports.remapSources = function(report)
{
	return Q.call(function()
	{
		// We do nothing by default.

		return report;
	});
}


exports.getBundleHeader = function()
{
	return [
	    'function define(id, dependencies, moduleInitializer)',
	    '{',
	    '    return function(require, exports, module) {',
        // @see http://requirejs.org/docs/api.html#cjsmodule
	    '        if (typeof moduleInitializer === "function") {',
	    '            return moduleInitializer.apply(moduleInitializer, dependencies.map(function(name) {',
	    '                if (name === "require") return require;',
	    '                if (name === "exports") return exports;',
	    '                if (name === "module") return module;',
	    '                return require(name);',
	    '            }))',
	    '        } else',
	    // @see http://requirejs.org/docs/api.html#defsimple
        '        if (typeof dependencies === "object") {',
        '            return dependencies;',
        '        }',
	    '    }',
	    '}'
	].join('\n');
}


exports.encodeModule = function(path, canonicalId, options)
{
	var deferred = Q.defer();

	REQUIREJS(["build", "parse"], function(BUILD, PARSE)
	{
		var originalCode = FS.readFileSync(path).toString(),
		    code,
		    ext = PATH.basename(path).replace(/^.*?\.([^\.]*)$/, "$1");
		
        // Check if module is a JavaScript file
        if (options.treatAs === "js-module")
        {
            try
            {
                code = BUILD.toTransport(BUILD.makeAnonDefRegExp(""), "", "", path, originalCode, false);
        		
        		// TODO: Do this properly in the step above instead of replacing code below.
        		PARSE.findDependencies(path, originalCode).filter(function(name)
                {
                    // We don't care about the CommonJS dependencies at this point.
                    if (name === "require" || name === "exports" || name === "module") return false;
    
                    // Look for certain plugin prefixes and remove.
                    var m;
                    if ((m = name.match(/^([^!]*)!(.*)$/)))
                    {
                        if (m[1] === "text" ||
                            // HACK to get around: https://github.com/ajaxorg/ace/blob/88fe36238449f1b74b2014965a4ea408fcee6392/demo/kitchen-sink/demo.js#L136
                            // TODO: Relocate to a bundler plugin that resides with the ACE project.
                            m[1] === "ace/requirejs/text")
                        {
                            var re = new RegExp("(['\"]{1})" + escapeRegExp(name) + "(['\"]{1})", "g");
                            code = code.replace(re, "$1" + m[2] + "$2");
                        }
                    }
                    return true;
                });    		
    
        		code = code.replace(/;[\s\n]*$/, "");
            }
            catch (e)
            {
                console.error("Error '" + e.message + "' parsing module: " + path);
                deferred.reject(e);
            }
        }

		deferred.resolve(code);
	});

	return deferred.promise;
}


// @credit http://simonwillison.net/2006/Jan/20/escape/
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
