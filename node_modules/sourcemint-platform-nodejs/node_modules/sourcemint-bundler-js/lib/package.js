
var PATH = require("path"),
	FS = require("fs"),
	Q = require("q"),
	UTIL = require("n-util");


var Package = exports.Package = function(path)
{
	this.path = path;
}

/**
 * Load all meta data for this package and all its dependencies.
 * If a package is not available locally, download it.
 * 
 * TODO: Download packages that are not locally available.
 */
Package.prototype.init = function(options)
{
	var deferred = Q.defer();

	this.options = options || {};

	// Set default descriptor values if provided.
	this.descriptor = UTIL.deepCopy(this.options.defaultDescriptor || {});

    // Try and load actual package descriptor on top.
	if (PATH.existsSync(this.path + "/package.json")) {
		try
		{
		    UTIL.deepUpdate(this.descriptor, JSON.parse(FS.readFileSync(this.path + "/package.json")));
		}
		catch(e) {
			throw new Error("Error '" + e + "' parsing JSON: " + this.path + "/package.json");
		}
	}
	// Override default and loaded descriptor if applicable.
	UTIL.deepUpdate(this.descriptor, UTIL.deepCopy(this.options.overrideDescriptor || {}));

	// Normalize package descriptor.
	if (typeof this.options.mainModule === "string") {
		this.descriptor.main = this.options.mainModule;
	}

	this.descriptor.directories = this.descriptor.directories || {};
	if (typeof this.descriptor.directories.lib === "undefined") {
		this.descriptor.directories.lib = "";
	}

	// Normalize bundler config.
	if (typeof this.descriptor.config === "undefined") {
		this.descriptor.config = {};
	}
	if (typeof this.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"] === "undefined") {
		this.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"] = {};
	}
	if (typeof this.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter === "undefined") {
//		this.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter = "github.com/sourcemint/sdk-commonjs/0";
		this.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter = "github.com/sourcemint/platform-nodejs/0";
	}

	// TODO: Look for `dependencies` and `mappings` and init these as well.

	deferred.resolve(this);

	return deferred.promise;
}

/**
 * Generate a report about all modules and relevant resources.
 */
Package.prototype.buildReport = function(masterReport, entryModule, moduleOptions)
{
	var self = this,
		bundlerAdapter = self.loadAdapterImplFor(self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter, "bundler");

	if (typeof masterReport.packages[self.path] === "undefined")
	{
		masterReport.packages[self.path] = {
			mainModule: {
				path: ((self.descriptor.main)?PATH.normalize(self.path + "/" + self.descriptor.main):undefined)
			},
			modules: {},
			mappings: {}
		};
	}

	function followModule(uri, moduleOptions)
	{
	    moduleOptions = moduleOptions || {};

	    return bundlerAdapter.resolveUri(uri).then(function(modulePath)
		{
            // Determine how the module should be treated based on its extension if not already specified.
	        var treatAs = moduleOptions.treatAs || false;
	        if (treatAs === false)
	        {
	            var ext = PATH.extname(modulePath);
	            if (ext === ".js") {
	                var code = FS.readFileSync(modulePath).toString();
                    // Check if code is simply a JSON structure.
	                if (/^[\s\n]*\{[\s\S]*\}[\s\n]*$/.test(code)) {
	                    treatAs = "json";
	                } else {
	                    // TODO: Determine automatically (or with configuration override) if file is a pure JS file (`js-pure`).
	                    treatAs = "js-module";
	                }
	            } else
                if (ext === ".json") {
                    treatAs = "json";
                } else {
                    // Treat everything else as text for now.
                    treatAs = "text";
                }
	        }

	        if (modulePath === "IGNORE")
			{
				// Do nothing.
			}
	        else
	        // If we have a JS module we parse the source to look for links.
	        // TODO: Allow other modules to be parsed for links (e.g. css).
            if (treatAs === "js-module")
			{
                var stats = FS.statSync(modulePath),
                    fileMtime = stats.mtime.getTime();

                if (self.options.bundler.bundle.report.sourceReport &&
                    self.options.bundler.bundle.report.sourceReport.packages &&
                    self.options.bundler.bundle.report.sourceReport.packages[self.path] &&
                    self.options.bundler.bundle.report.sourceReport.packages[self.path].modules &&
                    self.options.bundler.bundle.report.sourceReport.packages[self.path].modules[modulePath] &&
                    self.options.bundler.bundle.report.sourceReport.packages[self.path].modules[modulePath].fileMtime &&
                    self.options.bundler.bundle.report.sourceReport.packages[self.path].modules[modulePath].fileMtime === fileMtime)
                {
                    return continueWithModuleReport(self.options.bundler.bundle.report.sourceReport.packages[self.path].modules[modulePath]);
                }
                else
                {
                    self.options.logger.log("[parseModule] Detected change in module: " + modulePath);

                    return bundlerAdapter.parseModule(modulePath, {
                        descriptor: self.descriptor,
                        packageReport: masterReport.packages[self.path],
                        packagePath: self.path,
                        treatAs: treatAs,
                        logger: self.options.logger
                    }).then(function(moduleReport)
                    {
                        self.options.logger.log("[parseModule] Parsed module: " + modulePath);

                        return continueWithModuleReport(moduleReport);
                    })
                }

                function continueWithModuleReport(moduleReport)
                {
                    return Q.call(function()
                    {
                        // Avoid circular dependencies.
                        if (masterReport.packages[self.path].modules[modulePath])
                        {
                            // Stop following modules.
                        }
                        else
                        {
                            moduleReport.fileMtime = fileMtime;
                            moduleReport.treatAs = moduleReport.treatAs || treatAs;
                            
                            masterReport.packages[self.path].modules[modulePath] = moduleReport;
                
                            var done = Q.ref();
                
                            // Go through each static link and resolve it.
                            UTIL.forEach(moduleReport.staticLinks, function(linkId)
                            {
                                if (typeof linkId[1] === "string") {
                                    linkId[1] = {
                                        id: linkId[1]
                                    };
                                }

                                done = Q.when(done, function()
                                {
                                    // TODO: Stop if `done` is rejected.

                                    if (/^\./.test(linkId[1].id))
                                    {
                                        // We have a relative path to be resolved within the package.
                                        return followModule(PATH.dirname(modulePath) + "/" + linkId[1].id, {
                                            treatAs: linkId[1].treatAs || false
                                        });
                                    }
                                    else
                                    {
                                        // We have a prefixed path pointing to an aliased package.

                                        var linkIdParts = linkId[1].id.match(/^([^\/]*)(\/(.*?))?$/).slice(1);

                                        if (typeof masterReport.packages[self.path].mappings[linkIdParts[0]] === "undefined")
                                        {
                                            if (typeof self.descriptor.mappings !== "object") {
                                                throw new Error("Package descriptor '" + self.path + "/package.json' does not specify 'mappings' needed to resolve aliased module '" + linkId[0] + "' ('" + linkId[1].id + "').");
                                            }
                
                                            if (typeof self.descriptor.mappings[linkIdParts[0]] === "undefined") {
                                                throw new Error("Package descriptor '" + self.path + "/package.json' does not specify 'mappings[\"" + linkIdParts[0] + "\"]' needed to resolve aliased module '" + linkId[0] + "' ('" + linkId[1].id + "').");
                                            }
        
                                            // TODO: Use common resolver here.
                                            masterReport.packages[self.path].mappings[linkIdParts[0]] = FS.realpathSync(self.path + "/" + self.descriptor.mappings[linkIdParts[0]]);
                                        }

                                        // Gather some extra config info for the package.
                                        var options = {};
                                        
                                        // Pass along our bundler configuration in case our dependency packages are of the same
                                        // type but do not declare bundler config. Only pass along relevant properties.
                                        options.defaultDescriptor = {
                                            config: {
                                                "github.com/sourcemint/bundler-js/0/-meta/config/0": {}
                                            }
                                        };
                                        if (self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter) {
                                            options.defaultDescriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter = self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter;
                                        }
                                        
                                        // Override bundler config for package if we have config info set for it in our package.
                                        if (typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages === "object" &&
                                            typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages[linkIdParts[0]] === "object" &&
                                            typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages[linkIdParts[0]].descriptor === "object")
                                        {
                                            options.overrideDescriptor = self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages[linkIdParts[0]].descriptor;
                                        }

                                        return self.options.bundler.getInitializedPackageForPath(masterReport.packages[self.path].mappings[linkIdParts[0]], options).then(function(pkg)
                                        {
                                            return pkg.buildReport(masterReport, linkIdParts[2]);
                                        });
                                    }
                                });
                            });
        
                            return Q.when(done).fail(function(err)
                            {
                                // TODO: Augment `err` with context info and remove console print.
                                if (!err.contextAnnounced)
                                {
                                    console.error("Error happed when trying to locate dependency for module: " + modulePath);
                                    err.contextAnnounced = true;
                                }
                                throw err;
                            });
                        }
                    });
                }
			} else {
			    // For all other modules we record the presence of the module and how it should be encoded.
                masterReport.packages[self.path].modules[modulePath] = {
                    treatAs: treatAs
                };
			}
		});
	}

	if (entryModule === null)
	{
	    return masterReport;
	}
	
	entryModule = entryModule || self.descriptor.main;

	if (!/^\./.test(entryModule) && !/\./.test(entryModule))
	{
		entryModule = self.descriptor.directories.lib + "/" + entryModule;
	}

	// Follow the main module to discover all dependencies.
	return followModule(self.path + "/" + entryModule, moduleOptions).then(function()
	{
	    if (typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].modules !== "undefined")
	    {
	        var done = Q.ref();

	        UTIL.forEach(self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].modules, function(moduleInfo)
	        {
	            // See if the main module for this package wishes to have the loader bundled.
                if (moduleInfo[1].bundleLoader === true &&
                    FS.realpathSync(self.path + "/" + moduleInfo[0]) === masterReport.packages[self.path].mainModule.path)
                {
                    // If the package is the main package we indicate that we want the loader bundled for the bundle.
                    if (masterReport.mainPackage === self.path) {
                        masterReport.bundleLoader = true;
                    }
                }

	            // See if we have any declared dynamicLinks that map to other packages.
	            if (typeof moduleInfo[1].dynamicLinks !== "undefined")
	            {
    	            moduleInfo[1].dynamicLinks.forEach(function(linkInfo)
    	            {
                        if (!/^[\.\/]/.test(linkInfo))
    	                {
                            done = Q.when(done, function()
                            {
                                var linkInfoParts = linkInfo.split("/");
                                
                                if (!self.descriptor.mappings) {
                                    throw new Error("Cloud not resolve dynamic load resolver '" + linkInfo + "' against package '" + self.path + "'. No 'mappings' property found in package descriptor!");
                                }
                                if (!self.descriptor.mappings[linkInfoParts[0]]) {
                                    throw new Error("Cloud not resolve dynamic load resolver '" + linkInfo + "' against package '" + self.path + "'. No 'mappings[\"" + linkInfoParts[0] + "\"]' property found in package descriptor!");
                                }
                                
                                var pkgPath = FS.realpathSync(self.path + "/" + self.descriptor.mappings[linkInfoParts[0]]);                            
                                
                                if (typeof masterReport.packages[self.path].mappings[linkInfoParts[0]] === "undefined")
                                {
                                    masterReport.packages[self.path].mappings[linkInfoParts[0]] = pkgPath;
                                }
                                
                                // TODO: Refactor this and use same external code here and above.
                                
                                // Gather some extra config info for the package.
                                var options = {};
                                
                                // Pass along our bundler configuration in case our dependency packages are of the same
                                // type but do not declare bundler config. Only pass along relevant properties.
                                options.defaultDescriptor = {
                                    config: {
                                        "github.com/sourcemint/bundler-js/0/-meta/config/0": {}
                                    }
                                };
                                if (self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter) {
                                    options.defaultDescriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter = self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter;
                                }
                                
                                // Override bundler config for package if we have config info set for it in our package.
                                if (typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages === "object" &&
                                    typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages[linkInfoParts[0]] === "object" &&
                                    typeof self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages[linkInfoParts[0]].descriptor === "object")
                                {
                                    options.overrideDescriptor = self.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].packages[linkInfoParts[0]].descriptor;
                                }
    
                                return self.options.bundler.getInitializedPackageForPath(pkgPath, options).then(function(pkg)
                                {
                                    return Q.when(pkg.buildReport(masterReport, null), function(report)
                                    {
                                        masterReport = report;
                                    });
                                });
                            });
    	                }
    	            });
	            }
	        });

	        return done;
	    }
	}).then(function()
	{
		return masterReport;
	});
}


Package.prototype.loadAdapterImplFor = function(uri, name)
{
	// TODO: Download requested adapter package via `sourcemint/downloader-js`.
	if (uri !== "github.com/sourcemint/sdk-requirejs/0" &&
		uri !== "github.com/sourcemint/platform-nodejs/0")
		throw new Error("Only the 'github.com/sourcemint/sdk-requirejs/0' or 'github.com/sourcemint/platform-nodejs/0' adapters are supported at this time!");

	var adapterPath = require.resolve("sourcemint-platform-nodejs/package.json"); //__dirname + "/../../../platform-nodejs/0";
	if (uri === "github.com/sourcemint/sdk-requirejs/0")
	{
		adapterPath = require.resolve("sourcemint-sdk-requirejs/package.json"); //__dirname + "/../../../sdk-requirejs/0";
	}
	
	adapterPath = PATH.dirname(adapterPath);
	
	// TODO: Load descriptor and look for config.
	var implPath = adapterPath + "/lib/" + name + ".js";
	
	if (!PATH.existsSync(implPath))
	{
		return false;
	}
	
	return require(implPath);
}

