// @sourcemint-bundle-loader: {"platformLoaderSource":{}}
var require, sourcemint;
(function() {
    var rootBundleLoader = function(uri, loadedCallback) {
// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js","fileMtime":1329241551000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    var HTTP = require("__nodejs__/http");
    
    
    exports.main = function(onReadyDeferred, options)
    {
    	var server = HTTP.createServer();
    
    	server.on("request", function (req, res)
    	{
    	    res.writeHead(200, {
    	    	"Content-Type": "text/plain"
    	    });
    	    res.end("Hello from 01-HelloWorldServer");
    	});
    
    	/*TEST*/ if (onReadyDeferred) {
    	/*TEST*/     server.once("listening", function() {
    	/*TEST*/         onReadyDeferred.resolve(function onTestDone(stoppedCallback) {
    	/*TEST*/ 		     server.once("close", function() {
    	/*TEST*/ 			     stoppedCallback();
    	/*TEST*/ 		     });
    	/*TEST*/ 		     server.close();
    	/*TEST*/ 	     });
    	/*TEST*/     });
    	/*TEST*/ }
    
    	server.listen(options.port, "127.0.0.1");
    
    	console.log("Server running at http://127.0.0.1:" + options.port + "/");
    }
    
    if (require.main === module) {
    	exports.main(null, {
    		port: 1337
    	});
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"private":true,"name":"sourcemint-platform-nodejs-examples-06-Demos-01-HelloWorldServer","version":"0.1.0","engines":{"nodejs":"0.x"},"scripts":{"test":"node test"},"main":"/main.js","directories":{"lib":""},"mappings":{"__nodejs__":"__nodejs.org/0__"}}
);
// @sourcemint-bundle-descriptor: {"file":"nodejs.org/0/package.json","id":"043956adb8f7b26566da4cdc0e2ca286566dc494/package.json"}
require.memoize("043956adb8f7b26566da4cdc0e2ca286566dc494/package.json", 
{"directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-ignore: 
        if (typeof loadedCallback === "function") loadedCallback();
    }
    function initLoader(exports) {
/**
 * Copyright: 2011 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

// NOTE: Remove lines marked /*DEBUG*/ when compiling loader for 'min' release!

// Ignore all globals except for `require`, `exports` and `sourcemint`.
// Declare `require` global but ignore if it already exists.
var require;
// Set `sourcemint` global no matter what.
var sourcemint = null;
// Combat pollution if used via <script> tag.
(function (global, document) {

	var loadedBundles = [],
		// @see https://github.com/unscriptable/curl/blob/62caf808a8fd358ec782693399670be6806f1845/src/curl.js#L69
		readyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 };


	// A set of modules working together.
	var Sandbox = function(sandboxIdentifier, loadedCallback, sandboxOptions) {

		var moduleInitializers = {},
			initializedModules = {},
			/*DEBUG*/ bundleIdentifiers = {},
			packages = {},
			headTag,
			loadingBundles = {};

		var sandbox = {
				id: sandboxIdentifier
			};

		/*DEBUG*/ function logDebug() {
		/*DEBUG*/ 	if (sandboxOptions.debug !== true) return;
		/*DEBUG*/ 	// NOTRE: This does not work in google chrome.
		/*DEBUG*/ 	//console.log.apply(null, arguments);
		/*DEBUG*/ 	if (arguments.length === 1) {
		/*DEBUG*/ 		console.log(arguments[0]);
		/*DEBUG*/ 	} else
		/*DEBUG*/ 	if (arguments.length === 2) {
		/*DEBUG*/ 		console.log(arguments[0], arguments[1]);
		/*DEBUG*/ 	} else
		/*DEBUG*/ 	if (arguments.length === 3) {
		/*DEBUG*/ 		console.log(arguments[0], arguments[1], arguments[2]);
		/*DEBUG*/ 	} else
		/*DEBUG*/ 	if (arguments.length === 4) {
		/*DEBUG*/ 		console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
		/*DEBUG*/ 	}
		/*DEBUG*/ }

		// @credit https://github.com/unscriptable/curl/blob/62caf808a8fd358ec782693399670be6806f1845/src/curl.js#L319-360
		function loadInBrowser(uri, loadedCallback) {
			/*DEBUG*/ logDebug("[sm-loader]", 'loadInBrowser("' + uri + '")"');
		    // See if we are in a web worker.
		    if (typeof importScripts !== "undefined") {
		        importScripts(uri.replace(/^\/?\{host\}/, ""));
		        loadedCallback();
		        return;
		    }
            if (/^\/?\{host\}\//.test(uri)) {
                uri = document.location.protocol + "//" + document.location.host + uri.replace(/^\/?\{host\}/, "");
            } else
            if (/^\//.test(uri)) {
                uri = document.location.protocol + "/" + uri;
            }
			if (!headTag) {
				headTag = document.getElementsByTagName("head")[0];
			}
			var element = document.createElement("script");
			element.type = "text/javascript";
			element.onload = element.onreadystatechange = function(ev) {
				ev = ev || global.event;
				if (ev.type === "load" || readyStates[this.readyState]) {
					this.onload = this.onreadystatechange = this.onerror = null;
					loadedCallback(function() {
						element.parentNode.removeChild(element);
					});
				}
			}
			element.onerror = function(e) {
				/*DEBUG*/ throw new Error("Syntax error or http error: " + uri);
			}
			element.charset = "utf-8";
			element.async = true;
			element.src = uri;
			element = headTag.insertBefore(element, headTag.firstChild);
		}

		function load(bundleIdentifier, packageIdentifier, loadedCallback) {
            if (packageIdentifier !== "") {
                bundleIdentifier = ("/" + packageIdentifier + "/" + bundleIdentifier).replace(/\/+/g, "/");
            }
			if (initializedModules[bundleIdentifier]) {
				// Module is already loaded and initialized.
				loadedCallback(sandbox);
			} else {
				// Module is not initialized.
				if (loadingBundles[bundleIdentifier]) {
					// Module is already loading.
					loadingBundles[bundleIdentifier].push(loadedCallback);
				} else {
					// Module is not already loading.
					loadingBundles[bundleIdentifier] = [];
					bundleIdentifier = sandboxIdentifier + bundleIdentifier;
					// Default to our script-injection browser loader.
					(sandboxOptions.rootBundleLoader || sandboxOptions.load || loadInBrowser)(bundleIdentifier, function(cleanupCallback) {
					    // The rootBundleLoader is only applicable for the first load.
                        delete sandboxOptions.rootBundleLoader;
						finalizeLoad(bundleIdentifier, packageIdentifier);
						loadedCallback(sandbox);
						if (cleanupCallback) {
							cleanupCallback();
						}
					});
				}
			}
		}

		// Called after a bundle has been loaded. Takes the top bundle off the *loading* stack
		// and makes the new modules available to the sandbox.
		// If a `packageIdentifier` is supplied we prefix it to all module identifiers anchored
		// at the root of the bundle (starting with `/`).
		function finalizeLoad(bundleIdentifier, packageIdentifier)
		{
			// Assume a consistent statically linked set of modules has been memoized.
			/*DEBUG*/ bundleIdentifiers[bundleIdentifier] = loadedBundles[0][0];
			var key;
			for (key in loadedBundles[0][1]) {
				// Only add modules that don't already exist!
				// TODO: Log warning in debug mode if module already exists.
				if (typeof moduleInitializers[key] === "undefined") {
					moduleInitializers[packageIdentifier + key] = loadedBundles[0][1][key];
				}
			}
			loadedBundles.shift();
		}

		var Package = function(packageIdentifier) {
			if (packages[packageIdentifier]) {
				return packages[packageIdentifier];
			}
			
			var descriptor = moduleInitializers[packageIdentifier + "/package.json"] || {
					main: "/main.js"
				},
				mappings = descriptor.mappings || {},
				directories = descriptor.directories || {},
				libPath = (typeof directories.lib !== "undefined" && directories.lib != "")?directories.lib + "/":"";
			
			var pkg = {
				id: packageIdentifier,
				main: descriptor.main
			};

			var Module = function(moduleIdentifier) {

				var moduleIdentifierSegment = moduleIdentifier.replace(/\/[^\/]*$/, "").split("/"),
					module = {
						id: moduleIdentifier,
						exports: {}
					};

				function normalizeIdentifier(identifier) {
				    // If we have a period (".") in the basename we want an absolute path from
				    // the root of the package. Otherwise a relative path to the "lib" directory.
				    if (identifier.split("/").pop().indexOf(".") === -1) {
				        // We have a module relative to the "lib" directory of the package.
				        identifier = identifier + ".js";
				    } else
				    if (!/^\//.test(identifier)) {
				        // We want an absolute path for the module from the root of the package.
				        identifier = "/" + identifier;
				    }
                    return identifier;
				}
				
				function resolveIdentifier(identifier) {
					// Check for relative module path to module within same package.
					if (/^\./.test(identifier)) {
						var segments = identifier.replace(/^\.\//, "").split("../");
						identifier = "/" + moduleIdentifierSegment.slice(1, moduleIdentifierSegment.length-segments.length+1).concat(segments[segments.length-1]).join("/");
						return [pkg, normalizeIdentifier(identifier)];
					} else
					// Check for mapped module path to module within mapped package.
					{
						identifier = identifier.split("/");
						/*DEBUG*/ if (typeof mappings === "undefined") {
						/*DEBUG*/ 	throw new Error("Descriptor for sandbox '" + sandbox.id + "' does not declare 'mappings' property needed to resolve module path '" + identifier.join("/") + "' in module '" + moduleIdentifier + "'!");
						/*DEBUG*/ }
						/*DEBUG*/ if (typeof mappings[identifier[0]] === "undefined") {
						/*DEBUG*/ 	throw new Error("Descriptor for sandbox '" + sandbox.id + "' does not declare 'mappings[\"" + identifier[0] + "\"]' property needed to resolve module path '" + identifier.join("/") + "' in module '" + moduleIdentifier + "'!");
						/*DEBUG*/ }
						return [Package(mappings[identifier[0]]), normalizeIdentifier(identifier.slice(1).join("/"))];
					}
				}
				
				// Statically link a module and its dependencies
				module.require = function(identifier) {
				    // HACK: RequireJS compatibility.
				    // TODO: Move this to a plugin.
				    if (typeof identifier !== "string") {
				        /*DEBUG*/ if (identifier.length > 1) {
			            /*DEBUG*/     throw new Error("Dynamic 'require([])' may only specify one module in module '" + moduleIdentifier + "'!");
				        /*DEBUG*/ }
				        return module.require.async.call(null, identifier[0], arguments[1]);
				    }
					identifier = resolveIdentifier(identifier);
					return identifier[0].require(identifier[1]).exports;
				};

				module.require.supports = [
		            "ucjs2-pinf-0"
		        ];

				module.require.id = function(identifier) {
					identifier = resolveIdentifier(identifier);
					return identifier[0].require.id(identifier[1]);
				};

				module.require.async = function(identifier, loadedCallback) {
					identifier = resolveIdentifier(identifier);
					identifier[0].load(identifier[1], loadedCallback);
				};

				module.require.sandbox = function() {
					if (arguments.length === 3)
					{
						arguments[2].load = arguments[2].load || sandboxOptions.load;
					}
	                // If the `programIdentifier` (first argument) is relative it is resolved against the URI of the owning sandbox (not the owning page).
					if (/^\./.test(arguments[0]))
					{
					    arguments[0] = sandboxIdentifier + "/" + arguments[0];
					    // HACK: Temporary hack as zombie (https://github.com/assaf/zombie) does not normalize path before sending to server.
					    arguments[0] = arguments[0].replace(/\/\.\//g, "/");
					}
					return sourcemint.sandbox.apply(null, arguments);
				}
				module.require.sandbox.id = sandboxIdentifier;

                // HACK: RequireJS compatibility.
                // TODO: Move this to a plugin.
                module.require.nameToUrl = function(identifier)
                {
                    return sandboxIdentifier + module.require.id(identifier);
                }

				module.load = function() {
					if (typeof moduleInitializers[moduleIdentifier] === "function") {
						
						var moduleInterface = {
							id: module.id,
							exports: undefined
						}

						// If embedded in bundle `isMain` will be set to `true` if bundle was `require.main`.
				        if (packageIdentifier === "" && pkg.main === moduleIdentifier && sandboxOptions.isMain === true) {
				        	module.require.main = moduleInterface;
				        }

						if (sandboxOptions.onInitModule) {
							sandboxOptions.onInitModule(moduleInterface, module, pkg, sandbox);
						}

						var exports = moduleInitializers[moduleIdentifier](module.require, module.exports, moduleInterface);
						if (typeof moduleInterface.exports !== "undefined") {
							module.exports = moduleInterface.exports;
						} else
						if (typeof exports !== "undefined") {
							module.exports = exports;
						}
					} else
					if (typeof moduleInitializers[moduleIdentifier] === "string") {
						// TODO: Use more optimal string encoding algorythm to reduce payload size?
						module.exports = decodeURIComponent(moduleInitializers[moduleIdentifier]);
					} else {
						module.exports = moduleInitializers[moduleIdentifier];
					}
				};

				/*DEBUG*/ module.getReport = function() {
				/*DEBUG*/ 	var exportsCount = 0,
				/*DEBUG*/ 		key;
				/*DEBUG*/ 	for (key in module.exports) {
				/*DEBUG*/ 		exportsCount++;
				/*DEBUG*/ 	}
				/*DEBUG*/ 	return {
				/*DEBUG*/ 		exports: exportsCount
				/*DEBUG*/ 	};
				/*DEBUG*/ };

				return module;
			};

			pkg.load = function(moduleIdentifier, loadedCallback) {
                load(((!/^\//.test(moduleIdentifier))?"/"+libPath:"") + moduleIdentifier, packageIdentifier, function() {
                    loadedCallback(pkg.require(moduleIdentifier).exports);                           
                });
			}

			pkg.require = function(moduleIdentifier) {
				var loadingBundlesCallbacks;
                if (!/^\//.test(moduleIdentifier)) {
                    moduleIdentifier = "/" + libPath + moduleIdentifier;
                }
				moduleIdentifier = packageIdentifier + moduleIdentifier;
				if (!initializedModules[moduleIdentifier]) {
					/*DEBUG*/ if (!moduleInitializers[moduleIdentifier]) {
					/*DEBUG*/ 	throw new Error("Module '" + moduleIdentifier + "' not found in sandbox '" + sandbox.id + "'!");
					/*DEBUG*/ }
					(initializedModules[moduleIdentifier] = Module(moduleIdentifier)).load();
				}
				if (loadingBundles[moduleIdentifier]) {
					loadingBundlesCallbacks = loadingBundles[moduleIdentifier];
					delete loadingBundles[moduleIdentifier];
					for (var i=0 ; i<loadingBundlesCallbacks.length ; i++) {
						loadingBundlesCallbacks[i](sandbox);
					}
				}
				return initializedModules[moduleIdentifier];
			}

            pkg.require.id = function(moduleIdentifier) {
                if (!/^\//.test(moduleIdentifier)) {
                    moduleIdentifier = "/" + libPath + moduleIdentifier;
                }
                return (((packageIdentifier !== "")?"/"+packageIdentifier+"/":"") + moduleIdentifier).replace(/\/+/g, "/");
            }

			/*DEBUG*/ pkg.getReport = function() {
			/*DEBUG*/ 	return {
			/*DEBUG*/ 		mappings: mappings
			/*DEBUG*/ 	};
			/*DEBUG*/ }

			if (sandboxOptions.onInitPackage) {
				sandboxOptions.onInitPackage(pkg, sandbox, {
					finalizeLoad: finalizeLoad,
					moduleInitializers: moduleInitializers
				});
			}

			packages[packageIdentifier] = pkg;

			return pkg;
		}

		// Get a module and initialize it (statically link its dependencies) if it is not already so
		sandbox.require = function(moduleIdentifier) {
			return Package("").require(moduleIdentifier);
		}

		// Call the 'main' module of the program
		sandbox.boot = function() {
			/*DEBUG*/ if (typeof Package("").main !== "string") {
			/*DEBUG*/ 	throw new Error("No 'main' property declared in '/package.json' in sandbox '" + sandbox.id + "'!");
			/*DEBUG*/ }
			return sandbox.require(Package("").main).exports;
		};

		// Call the 'main' exported function of the main' module of the program
		sandbox.main = function() {
			var exports = sandbox.boot();
			return ((exports.main)?exports.main.apply(null, arguments):undefined);
		};

		/*DEBUG*/ sandbox.getReport = function() {
		/*DEBUG*/ 	var report = {
		/*DEBUG*/ 			bundles: {},
		/*DEBUG*/ 			packages: {},
		/*DEBUG*/ 			modules: {}
		/*DEBUG*/ 		},
		/*DEBUG*/ 		key;
		/*DEBUG*/ 	for (key in bundleIdentifiers) {
		/*DEBUG*/ 		report.bundles[key] = bundleIdentifiers[key];
		/*DEBUG*/ 	}
		/*DEBUG*/ 	for (key in packages) {
		/*DEBUG*/ 		report.packages[key] = packages[key].getReport();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	for (key in moduleInitializers) {
		/*DEBUG*/ 		if (initializedModules[key]) {
		/*DEBUG*/ 			report.modules[key] = initializedModules[key].getReport();
		/*DEBUG*/ 		}
		/*DEBUG*/ 	}
		/*DEBUG*/ 	return report;
		/*DEBUG*/ }

		load(".js", "", loadedCallback);

		return sandbox;
	};


	// The global `require` for the 'external' (to the loader) environment.
	var Loader = function() {

		var 
			/*DEBUG*/ bundleIdentifiers = {},
			sandboxes = {};

		var Require = function(bundle) {

				// Address a specific sandbox or currently loading sandbox if initial load.
				this.bundle = function(uid, callback) {
					/*DEBUG*/ if (typeof bundle !== "undefined") {
					/*DEBUG*/ 	throw new Error("You cannot nest require.bundle() calls!");
					/*DEBUG*/ }
					/*DEBUG*/ if (uid && bundleIdentifiers[uid]) {
					/*DEBUG*/ 	throw new Error("You cannot split require.bundle(UID) calls where UID is constant!");
					/*DEBUG*/ }
					/*DEBUG*/ bundleIdentifiers[uid] = true;
					var moduleInitializers = {},
						req = new Require(uid);
					// Store raw module in loading bundle
					req.memoize = function(moduleIdentifier, moduleInitializer) {
						moduleInitializers[moduleIdentifier] = moduleInitializer;
					}
					callback(req);
					loadedBundles.push([uid, moduleInitializers]);
				}
			};

		var require = new Require();

		// TODO: @see URL_TO_SPEC
		require.supports = [
			"ucjs2-pinf-0"
		];

		// Create a new environment to memoize modules to.
		// If relative, the `programIdentifier` is resolved against the URI of the owning page (this is only for the global require).
		require.sandbox = function(programIdentifier, loadedCallback, options) {
			var sandboxIdentifier = programIdentifier.replace(/\.js$/, "");
			return sandboxes[sandboxIdentifier] = Sandbox(sandboxIdentifier, loadedCallback, options || {});
		}
		
		/*DEBUG*/ require.getReport = function() {
		/*DEBUG*/ 	var report = {
		/*DEBUG*/ 			sandboxes: {}
		/*DEBUG*/ 		},
		/*DEBUG*/ 		key;
		/*DEBUG*/ 	for (key in sandboxes) {
		/*DEBUG*/ 		report.sandboxes[key] = sandboxes[key].getReport();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	return report;
		/*DEBUG*/ }

		return require;
	}


	sourcemint = Loader();


	// Ignore `require` global if already exists.
    if (!require) {
        require = sourcemint;
    }

	// Export `require` for CommonJS if `exports` global exists.
	if (typeof exports === "object") {
		exports.require = sourcemint;
	}

}(this, (typeof document !== "undefined")?document:null));    };
    if (typeof sourcemint === "undefined") {
        sourcemint = {};
        var LOADER_INJECTED = {};
        initLoader(LOADER_INJECTED);
        (function(require, exports) {
            /**
 * Copyright: 2012 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

// When embedded in bundle `LOADER_INJECTED` is populated with the `require("sourcemint-loader-js/loader")` exports.
var LOADER;
if (typeof LOADER_INJECTED !== "undefined") {
	LOADER = LOADER_INJECTED;
} else {
	LOADER = require("sourcemint-loader-js/loader");
}
var VM = require("vm"),
    PATH = require("path"),
    FS = require("fs"),
    HTTP = require("http"),
    HTTPS = require("https");


exports.getReport = LOADER.require.getReport;

exports.sandbox = function(sandboxIdentifier, loadedCallback, sandboxOptions)
{
	sandboxOptions = sandboxOptions || {};

	var options = {},
		key;
	
	for (key in sandboxOptions)
	{
		options[key] = sandboxOptions[key];
	}
	
	// Set our own loader for the sandbox.
	options.load = function(uri, loadedCallback)
    {
		exports.resolveURI(uri, function(err, uri)
		{
			if (err)
			{
				throw err;
			}

			exports.loadBundleCode(uri, function(err, code)
			{
				if (err)
				{
					throw err;
				}

			    try
			    {
			    	evalBundle(uri, code);

			        loadedCallback();		        
			    }
			    catch(err)
			    {
			    	throw err;
			    }
			});
		});
	}
	
	function evalBundle(uri, code)
	{
    	// NOTE: If there are sytnax errors in code this will print
    	//		 error to stdout (if fourth argument set to `true`).
    	//		 There is no way to capture errors from here.
    	// @see https://github.com/joyent/node/issues/1307#issuecomment-1551157
    	// TODO: Find a better solution to handle errors here.
    	// TODO: Capture errors by watching this processe's stdout file log from
    	//		 another process.
        VM.runInNewContext(code, {
		    // TODO: Inject and fix environment based on options.
        	require: LOADER.require,
        	sourcemint: LOADER.require,
        	// TODO: Wrap to `console` object provided by `sandboxOptions` and inject module info.
        	console: console,
        	// NodeJS globals.
        	// @see http://nodejs.org/docs/latest/api/globals.html
        	global: global,
        	process: process,
        	Buffer: Buffer,
        	setTimeout: setTimeout,
        	clearTimeout: clearTimeout,
        	setInterval: setInterval,
        	clearInterval: clearInterval
        }, uri, true);
	}

	options.onInitModule = function(moduleInterface, moduleObj, pkg)
	{
		if (sandboxOptions.onInitModule)
		{
			sandboxOptions.onInitModule(moduleInterface, moduleObj);
		}

		// @see http://nodejs.org/docs/latest/api/globals.html
		
		// TODO: Implement `require.cache`. Will need proxies to do that.

		moduleObj.require.resolve = function()
		{
			return moduleObj.require.id.apply(null, arguments);
		}
	};
	
	options.onInitPackage = function(pkg, sandbox, options)
	{
		var origRequire = pkg.require;
		pkg.require = function(moduleIdentifier)
		{
            var canonicalId = (pkg.id + "/" + moduleIdentifier).replace(/\/+/, "/");

            // HACK
			// TODO: Use a better flag than '__' to indicate that module should be loaded here!
			if (pkg.id === "__nodejs.org/0__")
			{
				return {
					exports: require(moduleIdentifier.replace(/\.js$/, ""))
				};
			}
			else
			if (typeof options.moduleInitializers[canonicalId] === "undefined")
			{
				// TODO: Check if module is memoized. If not we assume we need to load bundle.
                // Check if `moduleIdentifier` resolves to a new bundle file on the local filesystem.

				var path = sandbox.id + "/" + canonicalId;

				if (PATH.existsSync(path))
				{
					// Load the bundle SYNCHRONOUSLY as new modules must be available before we return.
			    	evalBundle(path, FS.readFileSync(path, "utf8"));

			    	// Activate the new modules from the bundle.
			    	options.finalizeLoad(path, pkg.id);

			    	// Now let the loader continue.
					return origRequire(moduleIdentifier);
				}
	            else
	            {
	                return origRequire(moduleIdentifier);
	            }
			}
            else
            {
                return origRequire(moduleIdentifier);
            }
		};
		
		pkg.require.id = origRequire.id;
	}
	
	LOADER.require.sandbox(sandboxIdentifier, function(sandbox)
	{
		loadedCallback(sandbox);
	}, options);
}


// TODO: Relocate this to github.com/pinf/core-js/lib/resolver.js and return PINF URI info object.
//		 Keep stub here for local FS uris so this module can be embedded in bundles without outside dependencies.
exports.resolveURI = function(uri, callback)
{
	var m;

	// The github case.
	// TODO: Match various vendor APIS.
	if (m = uri.match(/^(github.com\/sourcemint\/loader-js\/0)\/-raw\/(.*)$/))
	{
		// TODO: Get `/pinf/workspaces` from `ENV.PINF_WORKSPACES` implemented at github.com/pinf/core-js/lib/env.js

		if (m[1] !== "github.com/sourcemint/loader-js/0") {
			callback(new Error("Only the 'github.com/sourcemint/loader-js/0' package is supported at this time!"));
			return;
		}

		callback(null, require.resolve("sourcemint-loader-js/" + m[2]));
	}
	else
	if (m = uri.match(/^http(s)?:\/\/([^\/]*)(.*)$/))
	{
		callback(null, uri);
	}
	else
	if (m = uri.match(/^(\/.*)$/))
	{
		callback(null, uri);
	}
	else
	{
		callback(new Error("Unable to resolve URI: " + uri));
	}
}

// TODO: Relocate this to github.com/sourcemint/downloader-js/lib/bundle.js#loadBundleCode
//		 Keep stub here for local FS uris so this module can be embedded in bundles without outside dependencies.
exports.loadBundleCode = function(uri, callback)
{
	var m;
	
	try
	{
		// Check for local absolute file path.
		if (m = uri.match(/^(\/.*)$/))
		{
			// TODO: Pass this implementation as `options.readFile` to github.com/sourcemint/downloader-js/lib/bundle.js#loadBundleCode
			FS.readFile(uri, "utf8", function(err, code)
			{
				if (err)
				{
					// TODO: Throw a nice error object.
					console.log("Error reading file: " + uri);
			    	callback(err);
			    	return;
				}
	
				callback(null, code);
			});
		}
		else
		// Check for HTTP(S) URI.
		if (m = uri.match(/^http(s)?:\/\/([^\/]*)(.*)$/))
		{
			// TODO: Relocate to github.com/sourcemint/downloader-js/lib/fetcher.js
			((m[1])?HTTPS:HTTP).get({
				host: m[2],
				path: (m[3])?m[3]:"/"
			}, function(response)
			{
				if (response.statusCode !== 200)
				{
			    	// TODO: Bubble this up to the loader's error handler.
					callback(new Error("Did not get status 200 for URL: " + uri));
					return;
				}
		
				var code = [];
		
				response.on("data", function(chunk)
				{
					code.push(chunk);
			    });
		
				response.on("end", function()
				{
					callback(null, code.join(""));
			    });
		
			}).on("error", function(err)
			{
		    	callback(err);
			});
		}
		else
		{
			callback(new Error("Unable to load bundle code from URI: " + uri));
		}
	}
	catch(err)
	{
		callback(err);
	}
}


        })(require, sourcemint);
        var platformRequire = require;
        var isMain = ((platformRequire && platformRequire.main === module)?true:false);
        require = LOADER_INJECTED.require;
        sourcemint.bundle = require.bundle;
        sourcemint.sandbox(((typeof __dirname !== "undefined")?__dirname:".") + "/01-HelloWorldServer.js", function(sandbox) {
            if (typeof exports === "object") {
                var mainExports = sandbox.boot();
                if (typeof mainExports === "function") {
                    module.exports = mainExports;
                } else {
                    for (var key in mainExports) {
                        exports[key] = mainExports[key];
                    }
                }
            } else {
                sandbox.main();
            }
        }, {
            rootBundleLoader: rootBundleLoader,
            isMain: isMain
        });
    } else {
        rootBundleLoader();
    }
})();
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1329241551000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1329241551000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/07-DemoBundles/dist-bundled-loader/01-HelloWorldServer.js","packages":{"043956adb8f7b26566da4cdc0e2ca286566dc494":"nodejs.org/0"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/01-HelloWorldServer/main.js"}}}
