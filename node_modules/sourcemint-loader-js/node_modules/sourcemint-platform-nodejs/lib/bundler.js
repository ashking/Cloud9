/**
 * Copyright: 2012 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

var FS = require("fs"),
	PATH = require("path"),
	Q = require("q"),
	UTIL = require("n-util"),
	WRENCH = require("wrench"),
	DETECTIVE = require("detective"),
	BUNDLER = require("sourcemint-platform-browser/lib/bundler");


// TODO: Use helper function from bundler where possible.
// TODO: Use AST to detect require statements.

exports.bundle = function(packagePath, distributionPath, options)
{
	options = options || {};

	options.bundleLoaderAdapter = options.bundleLoaderAdapter || "github.com/sourcemint/platform-nodejs/0";

	return BUNDLER.bundle(packagePath, distributionPath, options);
}

exports.hoist = function(basePath, baseOptions)
{
	baseOptions = baseOptions || {};

	baseOptions.bundleLoaderAdapter = baseOptions.bundleLoaderAdapter || "github.com/sourcemint/platform-nodejs/0";

	return BUNDLER.hoist(basePath, baseOptions);
}


exports.getPlatformLoaderSource = function() {
	return Q.ncall(FS.readFile, FS, PATH.join(__dirname, "loader.js"), "utf8");
}


exports.parseModule = function(path, options)
{
	var deferred = Q.defer();

	Q.call(function()
	{
		var report = {};

		if (options.logger) options.logger.log("[platform-nodejs:parseModule] treatAs: " + options.treatAs);

		if (options.treatAs === "js-module")
		{
    		var code = FS.readFileSync(path).toString();
    
    		report.staticLinks = {};
    		report.dynamicLinks = {};

			if (options.logger) options.logger.log("[platform-nodejs:parseModule] Parse " + code.length + " bytes using detective.");

			code = "((function(){" + code + "})());";

/*
			var lines = code.split("\n");
			lines.forEach(function(line, index) {
				process.stdout.write(index + ": " + line + "\n");
			});
*/

    		// NOTE: We wrap the module code in a function to ensure we don't fail on top-level `return`s.
    		var matches = DETECTIVE.find(code);

			if (options.logger) options.logger.log("[platform-nodejs:parseModule] matches: " + JSON.stringify(matches));
    		
    		matches.strings.forEach(function(id)
    		{
    			report.staticLinks[id] = adjustStaticLink(path, id, options);
    		});
    
    		if (matches.expressions.length > 0)
    		{
    			// TODO: Ensure there are `` defined in the package descriptor of the package.
    			// TODO: Throw in struct mode.
    			// 		 throw new Error("Found variable argument to require statement 'require(" + id + ")' in module '" + path + "'. 'require()' only accepts a string literal. Use 'require.async(" + id + ", function(EXPORTS) {})' instead.");
    		}
    
    		// TODO: Use `detective` to find.
    		scrapeAsyncRequires(code).forEach(function(name)
    		{
    			report.dynamicLinks[name] = name;
    		});
    
    		// TODO: Look for `require.resolve("<str>")` and `require.id("<str>")`.
		}

		deferred.resolve(report);
	}).fail(function(err)
	{
		err.stack = "Error '" + err.message + "' while parsing module: " + path + "\n" + err.stack;
		deferred.reject(err);
	});

	return deferred.promise;
}

/**
 * All static links that point to global modules (not mapped in package descriptor)
 * get resolved based on dependency declarations and mapped.
 */
function adjustStaticLink(path, id, options)
{
	// We don't care about relative links.
	if (/^\./.test(id))
	{
		return id;
	}
	// We don't care about already mapped links.
	var idParts = id.match(/^([^\/]*)(\/(.*?))?$/);
	if (idParts && 
		typeof options.descriptor.mappings === "object" &&
	    typeof options.descriptor.mappings[idParts[1]] !== "undefined")
	{
		return id;
	}

	// See if we have a NodeJS native module.
	// TODO: Instead of using this NodeJS environment to check if module is native use a different test that
	//		 is specific to the NodeJS version we are bundling for.
	
	function lookup()
	{
		var idPath = findNodeModulesPackage(PATH.dirname(path), idParts[1]);
		
		if (!idPath)
		{
			throw new Error("Unable to locate package '" + id + "' in 'node_modules/' directories starting at '" + path + "'.");
		}

		if (typeof options.packageReport.mappings[idParts[1]] === "undefined")
		{
			options.packageReport.mappings[idParts[1]] = idPath;
		}

		if (!idParts[2])
		{
			var descriptor = JSON.parse(FS.readFileSync(idPath + "/package.json"));

			var main = descriptor.main || "/index.js";
			
			main = main.replace(/^\./, "");
			
			if (!/^\//.test(main))
			{
				main = "/" + main;
			}
			
			if (!/\.js$/.test(main) && !PATH.existsSync(idPath + main))
			{
				main += ".js";
			}

			id += main;
		}

		return id;
	}
	
	try
	{
		if (id === require.resolve(id))
		{
			if (typeof options.packageReport.mappings["__nodejs__"] === "undefined")
			{
				options.packageReport.mappings["__nodejs__"] = "nodejs.org/0";
			}
			return "__nodejs__/" + id;
		}
		return lookup();
	}
	catch(e)
	{
		return lookup();
	}
	
	return id;
}

function findNodeModulesPackage(path, name)
{
	if (PATH.existsSync(path + "/node_modules/" + name + "/package.json"))
	{
		return FS.realpathSync(path + "/node_modules/" + name);
	}
	else
	if (PATH.dirname(path) !== path)
	{
		return findNodeModulesPackage(PATH.dirname(path), name);
	}
	return false;	
}


/**
 * Scrape dependencies from a Modules/1.1 module. Mostly borrowed from FlyScript.
 * Instead of just looking for string literals we also look for dynamic requires.
 * @source http://code.google.com/p/bravojs/source/browse/bravo.js
 * @todo Use AST analysis here instead of regular expression.
 */
function scrapeAsyncRequires(txt)
{
    var dep = [],
        m,
        requireRE = /\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|[;=(,:!^]\s*\/(?:\\.|[^\/\\])+\/|(?:^|[^A-Za-z0-9_\.])\s*require\.async\s*\(\s*("(?:\\[\s\S]|[^"\\,])*"|'(?:\\[\s\S]|[^'\\,])*'|(?:\\[\s\S]|[^\)\\,])*)\s*,/g;
    for (requireRE.lastIndex = 0; m = requireRE.exec(txt);)
        if (m[1]) dep.push(m[1]);
    return dep;
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
		if (/^nodejs\.org\/0\//.test(uri))
		{
			return "IGNORE";
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
	return "";
}


exports.encodeModule = function(path, canonicalId, options)
{
	return Q.call(function()
	{
		var code = FS.readFileSync(path).toString(),
		    ext = PATH.basename(path).replace(/^.*?\.([^\.]*)$/, "$1");

        if (options.treatAs === "js-module")
        {
			var basePath = options.bundlePath.replace(/\.js$/, "");
			
			var dirname = PATH.dirname(canonicalId);
			if (dirname === "/") {
				dirname = "";
			} else
			if (!/^\//.test(dirname)) {
				dirname = "/" + dirname;
			}

			code = [
			    'function(require, exports, module)\n{',
			    // @see http://nodejs.org/docs/latest/api/globals.html
			    // TODO: Inject and fix environment based on options.
			    '    var __filename = require.sandbox.id + "' + canonicalId + '";',
			    '    var __dirname = require.sandbox.id + "' + dirname + '";',
			    '    ' + replaceStaticLinks(code).split('\n').join('\n    '),
			    '}'
			].join('\n');
		}
		
		function replaceStaticLinks(code)
		{
			// If any of the static links have been remapped during the bundling process
			// we adjust the code here.
			for (var id in options.staticLinks)
			{
				if (options.staticLinks[id] !== id)
				{
					// TODO: Do this much more elegantly.
					var re = new RegExp("(require\\([\"'])" + id + "([\"']\\))", "g");
					code = code.replace(re, "$1" + options.staticLinks[id] + "$2");
				}
			}
			return code;
		}

		return code;
	});
}

