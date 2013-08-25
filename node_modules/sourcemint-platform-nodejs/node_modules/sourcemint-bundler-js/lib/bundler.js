
var PATH = require("path"),
	FS = require("fs"),
	Q = require("q"),
	PACKAGE = require("./package"),
	CRYPTO = require("crypto"),
	UTIL = require("n-util"),
	GLOB = require("glob"),
	WRENCH = require("wrench"),
	BUNDLE = require("./bundle");


exports.bundle = function(packagePath, distributionPath, options)
{
	if (!PATH.existsSync(distributionPath))
	{
	    WRENCH.mkdirSyncRecursive(distributionPath, 0755);
	}
	// TODO: Make distribution path configurable via `options`.
	distributionPath = distributionPath + "/" + PATH.basename(packagePath);
	
	options = UTIL.copy(options);
	
	if (typeof options.forceCompleteBuild === "undefined")
	{
	    options.forceCompleteBuild = true;
	}

	return ((new Bundler(packagePath, distributionPath, options)).generateBundles());
}


var bundlerInstances = {};

var Bundler = exports.Bundler = function(packagePath, distributionPath, options)
{
    // If we are called as a factory we create an instance if we don't already have one.
    if (!(this instanceof Bundler))
    {
        // Check if we already have an instance.
        var instanceKey = distributionPath;
        if (bundlerInstances[instanceKey])
        {
            if (bundlerInstances[instanceKey][0] !== packagePath) {
                throw new Error("Cannot store a different package '" + packagePath + "' in the same distribution path '" + instanceKey + "' as already used by package '" + bundlerInstances[instanceKey][0] + "'!");
            }
            if (bundlerInstances[instanceKey][1] !== JSON.stringify(options)) {
                throw new Error("Cannot store the same package '" + packagePath + "' in the same distribution path '" + instanceKey + "' using different options!");
            }
            return bundlerInstances[instanceKey][2];
        }

        bundlerInstances[instanceKey] = [
            packagePath,
            JSON.stringify(options),
            new Bundler(packagePath, distributionPath, options)
        ];
        return bundlerInstances[instanceKey][2];
    }
    
	this.packagePath = FS.realpathSync(packagePath);

	if (!FS.statSync(this.packagePath).isDirectory())
	{
		throw new Error("Package path '" + packagePath + "' is not a directory!");
	}
	this.distributionPath = distributionPath;

	this.options = options || {};
	
	if (!this.options.packageIdHashSeed)
	{
		this.options.packageIdHashSeed = new Date().getTime() + Math.random();
	}
	
	if (!this.options.logger) {
		if (this.options.debug) {
		    this.options.logger = {
		        log: console.log.bind(null)
		    };
		} else {
		    this.options.logger = {
		        log: function() {}
		    };
		}
	}

	this.packages = {};

	var self = this;

	self.options.logger.log("Bundle package '" + self.packagePath + "' and store at '" + self.distributionPath + "'.");

	// Give back a promise for the package until it has been provisioned locally.
    var deferred = Q.defer();
    self.programPackage = function() {
        return deferred.promise;
    };

    Q.when(BUNDLE.forPath(self.distributionPath + ".js"), function(info)
    {
        self.bundle = info[0];

        if (info[1])
        {
            // The bundle loaded OK.
            init1();
        }
        else
        {
            // There was an error loading the bundle.
            // We continue by regenerating the bundle in hopes of fixing it.
            init1(true);
        }
    }, function(err)
    {
        console.error("Fatal error loading bundle!", err.stack);
    });

	function init1(forceCompleteBuild)
	{
	    Q.call(function()
	    {
    	    if (forceCompleteBuild === true || self.options.forceCompleteBuild === true)
    	    {
    	        if (PATH.existsSync(self.distributionPath)) {
    	            WRENCH.rmdirSyncRecursive(self.distributionPath);
    	        }
    	        if (PATH.existsSync(self.distributionPath + ".js")) {
    	            FS.unlinkSync(self.distributionPath + ".js");
    	        }
    	        return self.bundle.reset().then(init2);
    	    }
    	    else
    	    {
    	        return init2();
    	    }

    	    function init2()
    	    {
                return self.getInitializedPackageForPath(self.packagePath, self.options).then(function(pkg) {

	                if (self.options.bundleLoader === true) {

	                	var opts = {
	                        bundleUrlPrefix: self.options.bundleUrlPrefix
	                    };

	                    // TODO: Do this more dynamically.
	                    if (self.options.bundleLoaderAdapter === "github.com/sourcemint/platform-nodejs/0")
	                    {
	                    	opts.platformLoaderSource = require("sourcemint-platform-nodejs/lib/bundler").getPlatformLoaderSource();
	                    }

	                    self.bundle.setBundleLoader(self.options.bundleLoader, opts);
	                }

                    deferred.resolve(pkg);
                });
    	    }
	    }).fail(function(err) {
	        // We had an error opening the bundle.
	        console.error(err.stack);
	    });
	}
}


Bundler.prototype.generateReport = function()
{
	var self = this;
	return Q.when(self.programPackage(), function(pkg)
	{
		var masterReport = {
				mainPackage: self.packagePath,
				packages: {}
			};

		return pkg.buildReport(masterReport);
	});
}


Bundler.prototype.getInitializedPackageForPath = function(path, options)
{
    var self = this;
    if (self.packages[path])
    {
        // NOTE: Assuming `options` are the same as the ones used to create instance originally!
        return Q.call(function() {
            return self.packages[path];
        });
    }
	options = options || {};
	var opts = UTIL.copy(self.options);
	opts.bundler = self;
    opts.defaultDescriptor = options.defaultDescriptor || {};
    opts.overrideDescriptor = options.overrideDescriptor || {};
	return (self.packages[path] = new PACKAGE.Package(path)).init(opts);
}


Bundler.prototype.generateBundles = function(allowRebuildOnSourceChanges)
{
	var self = this;

	var masterReport = {
			sourceReport: {},
			mappedReport: {},
			bundleReport: {
				mainBundle: false,
				packages: {},
				modules: {}
			}
		},	
		packagePathIdMap = {},
		packageDescriptors = [],
		dynamicLoadBundles = {};

	function packageIdForPath(path)
	{
	    // See if we are referring to the main package
	    if (path === masterReport.mappedReport.mainPackage)
	    {
	        return "";
	    }
		if (packagePathIdMap[path])
		{
			return packagePathIdMap[path];
		}
		
		var shasum = CRYPTO.createHash("sha1");
		shasum.update(self.options.packageIdHashSeed + ":" + path);
		packagePathIdMap[path] = shasum.digest("hex");

		masterReport.bundleReport.packages[packagePathIdMap[path]] = path;
		
		return packagePathIdMap[path];
	}
	
	function bundleModule(module, context)
	{
		var localId = module[0].replace(context.pkg[0], ""),
			canonicalId = context.pkgNamespace + localId;
		
		// Check if module is already in a bundle that called this bundle.
		if (typeof self.options.existingModules !== "undefined" && 
			UTIL.isArrayLike(self.options.existingModules) && 
			self.options.existingModules.indexOf(module[0]) >= 0)
		{
		    // Module is already in a bundle higher up the hierarchy. Before we exclude it
		    // we make sure the bundle does not bundle the loader. If it does we include all modules.
		    // TODO: Add option to ignore existing even if loader bundled.
		    if (masterReport.bundleReport.bundleLoader !== true)
		    {
	            return;
		    }
		}
		masterReport.bundleReport.modules[canonicalId] = module[0];

		
		var treatAs = masterReport.mappedReport.packages[context.pkg[0]].modules[module[0]].treatAs,
		    fileMtime = masterReport.mappedReport.packages[context.pkg[0]].modules[module[0]].fileMtime || 0;

		// TODO: Refactor this into plugins.
		if (treatAs === "json")
		{
		    var code = FS.readFileSync(module[0]).toString();
		    context.bundle.setModule(canonicalId, code.replace(/^[\s\n]*/, ""), {
		        file: module[0],
		        fileMtime: fileMtime
		    });
            return;
		}
		else
        if (treatAs === "text")
        {
            var code = FS.readFileSync(module[0]).toString();
            context.bundle.setModule(canonicalId, '"' + encodeURIComponent(code) + '"', {
                file: module[0],
                fileMtime: fileMtime
            });
            return;
        } else
        if (treatAs !== "js-module")
        {
            throw new Error("Unknown module encoding '" + treatAs + "' requested for: " + module[0]);
        }

		if (context.bundle.modules[canonicalId] &&
	        context.bundle.modules[canonicalId][0] &&
            fileMtime < self.bundle.mtime)
		{
	        return continueWithBundlingModule(context.bundle.modules[canonicalId][0]);
		}
		else
		{
            // mtime is not set for module in report as module was added fresh when building report.
            self.options.logger.log("[encodeModule] Detected change in module: " + module[0]);

            return context.bundlerAdapter.encodeModule(module[0], canonicalId, {
                staticLinks: module[1].staticLinks,
                bundlePath: context.bundlePath,
                treatAs: treatAs,
                logger: self.options.logger
            }).then(function(code)
            {
				self.options.logger.log("[encodeModule] Encoded module: " + module[0]);

                return continueWithBundlingModule(code);
            });
		}
		
		function continueWithBundlingModule(code)
		{
		    return Q.call(function()
		    {
		        context.bundle.setModule(canonicalId, code.replace(/^[\s\n]*/, ""), {
	                file: module[0],
	                fileMtime: fileMtime
	            });

		        if (typeof context.pkgObj.descriptor.config !== "object" ||
	                typeof context.pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"] !== "object" ||
	                typeof context.pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].modules !== "object")
	            {
	                if (module[1].dynamicLinks && UTIL.len(module[1].dynamicLinks) > 0) {
	                    throw new Error("Package descriptor '" + context.pkgObj.path + "/package.json' for module '" + module[0] + "' does not declare dynamicLinks needed for 'require.async()' at 'config[\"github.com/sourcemint/bundler-js/0/-meta/config/0\"].modules[\"*\"].dynamicLinks'.");
	                }
	                return;
	            }
	            
	            var done = Q.ref();
	            
	            // For each dynamic link look for a declaration in the package descriptor.
	            var moduleDeclaration = context.pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].modules[localId];

	            if (typeof moduleDeclaration === "undefined" || typeof moduleDeclaration.dynamicLinks === "undefined" || !UTIL.isArrayLike(moduleDeclaration.dynamicLinks))
	            {
	                if (module[1].dynamicLinks && UTIL.len(module[1].dynamicLinks) > 0) {
	                    throw new Error("Package descriptor '" + context.pkgObj.path + "/package.json' for module '" + module[0] + "' does not declare dynamicLinks needed for 'require.async()' at 'config[\"github.com/sourcemint/bundler-js/0/-meta/config/0\"].modules[\"" + canonicalId + "\"].dynamicLinks = []'.");
	                }
	                return;
	            }

	            // For each resolver build the requested bundles
	            moduleDeclaration.dynamicLinks.forEach(function(dynamicLink)
	            {
	                done = Q.when(done, function()
	                {
	                    if (typeof dynamicLink === "string")
	                    {
	                        if (/^[\.\/]/.test(dynamicLink))
	                        {
	                            // Resolve a link relative to this (the declaring) package.
	                            return resolve(dynamicLink, context.pkg[0], context.pkgNamespace);
	                        }
	                        else
	                        {
	                            // Resolve a link relative to a mapped package.
	                            // TODO: Use a more generic resolver here that is used in other places as well.
	                            var dynamicLinkParts = dynamicLink.split("/");
	                            var pkgPath = FS.realpathSync(context.pkgObj.path + "/" + context.pkgObj.descriptor.mappings[dynamicLinkParts[0]]);
	                            
	                            return self.getInitializedPackageForPath(pkgPath).then(function(pkg)
	                            {
	                                var link = dynamicLinkParts.slice(1).join("/");
	                                // Prefix lib path if applicable.
	                                if (pkg.descriptor.directories.lib !== "") {
	                                    link = pkg.descriptor.directories.lib + "/" + link;
	                                }
	                                    
	                                if (PATH.extname(link) === "") {
	                                    link += ".js";
	                                }

	                                return resolve(link, pkgPath, packageIdForPath(pkgPath));
	                            });
	                        }

	                        function resolve(link, packagePath, pkgNamespace)
	                        {
	                            var deferred = Q.defer();

	                            var defaultDescriptor = {
	                                config: {
	                                    "github.com/sourcemint/bundler-js/0/-meta/config/0": {}
	                                }
	                            };
	                            if (context.pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter) {
	                                defaultDescriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter = context.pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter;
	                            }

	                            GLOB(link, {
	                                root: packagePath,
	                                cwd: packagePath,
	                                nomount: true
	                            }, function (err, files)
	                            {
	                                if (err) deferred.reject(err);
	                                else
	                                {
	                                    files.forEach(function(file)
	                                    {
	                                        var modulePath = FS.realpathSync(packagePath + "/" + file);
	                                        dynamicLoadBundles[modulePath] = {
	                                            uri: file,
	                                            packagePath: packagePath,
	                                            modulePath: modulePath,
	                                            pkgNamespace: pkgNamespace,
	                                            defaultDescriptor: defaultDescriptor
	                                        };
	                                    });
	                                    deferred.resolve();
	                                }
	                            });

	                            return deferred.promise;
	                        }
	                    }
	                    else
	                        throw new Error("Dynamic link '" + dynamicLink + "' declared in package descriptor '" + context.pkg[0] + "/package.json' not supported!");
	                });
	            });

	            return done;
	        });
		}
	}
	
	function bundlePackage(pkg, context)
	{
		context = UTIL.copy(context);

		// If we are not dealing with the main package we need to alias modules into the canonical namespace for the bundle.
		context.pkgNamespace = "";
		if (pkg[0] !== masterReport.mappedReport.mainPackage)
		{
			context.pkgNamespace = packageIdForPath(pkg[0]);
		}
		context.pkg = pkg;

		return self.getInitializedPackageForPath(pkg[0]).then(function(pkgObj)
		{
			context.pkgObj = pkgObj;
	        context.bundlerAdapter = pkgObj.loadAdapterImplFor(pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter, "bundler");

			var pkgDescriptorId = "/package.json",
				descriptor = UTIL.deepCopy(pkgObj.descriptor);
			
			// Remove some stuff in the package descriptor that is irrelevant on the client now.
			// TODO: Use a setting to determine what to remove.
			if (descriptor.main) {
				descriptor.main = descriptor.main.replace(/^\.(\/)/, "$1");
			}
			if (typeof descriptor.config === "object") {
				delete descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"];
			}
			if (UTIL.len(descriptor.config) === 0) {
				delete descriptor.config;
			}

			packageDescriptors.push(function()
			{
				descriptor.mappings = {};
				if (UTIL.len(masterReport.mappedReport.packages[pkg[0]].mappings) > 0)
				{
					UTIL.forEach(masterReport.mappedReport.packages[pkg[0]].mappings, function(mapping)
					{
						// HACK
						// TODO: Use a better flag than '__' to indicate that mapping should be handled by loader!
						if (/^__.*?__$/.test(mapping[0])) {
							descriptor.mappings[mapping[0]] = "__" + mapping[1] + "__";
						}
						else
						{
							// TODO: Use common resolver here.
							descriptor.mappings[mapping[0]] = packageIdForPath(mapping[1]);
						}
					});
				}

	            context.bundle.setDescriptor(context.pkgNamespace + pkgDescriptorId, JSON.stringify(descriptor), {
	                file: pkgObj.path + pkgDescriptorId
	            });
			});

			var done = Q.ref();
			UTIL.forEach(pkg[1].modules, function(module)
			{
				done = Q.when(done, function()
				{
					return bundleModule(module, context);
				})
			});

			return Q.when(done, function()
			{
				if (typeof pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].resources === "undefined" ||
					!UTIL.isArrayLike(pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].resources))
				{
					return;
				}
				var done = Q.ref();
				pkgObj.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].resources.forEach(function(resource)
				{
					done = Q.when(done, function()
					{
						if (typeof resource === "string")
						{
							var done = Q.ref();

							GLOB(resource, {
							    root: pkg[0],
								cwd: pkg[0],
								nomount: true
							}, function (err, files)
							{
							    if (err) throw err;
								else
								{
									files.forEach(function(file)
									{
										if (FS.statSync(pkg[0] + "/" + file).isFile())
										{
											done = Q.when(done, function()
											{
												// TODO: If error happens here we should fail!

												var deferred = Q.defer();

												var targetPath = self.distributionPath + ((context.pkgNamespace)?"/"+context.pkgNamespace:"")  + "/" + file;

												if (!PATH.existsSync(PATH.dirname(targetPath))) {
													WRENCH.mkdirSyncRecursive(PATH.dirname(targetPath), 0775);
												}

												var newFile = FS.createWriteStream(targetPath);

												newFile.once("close", function() {
													deferred.resolve();
												});

												newFile.once("open", function() {
												    var oldFile = FS.createReadStream(pkg[0] + "/" + file);
												    oldFile.once("open", function() {
												        require("util").pump(oldFile, newFile);
												    });
												});

												return deferred.promise;
											});
										}
									});
								}
							});

							return done;
						}
						else
							throw new Error("Resource '" + resource + "' in package descriptor '" + context.pkg[0] + "/package.json' not supported!");
					});
				});
				return done;
			});
		});
	}

	return Q.when(self.programPackage(), function(pkg)
	{
		return self.generateReport().then(function(sourceReport)
		{
			masterReport.sourceReport = sourceReport;

			var bundlerAdapter = pkg.loadAdapterImplFor(pkg.descriptor.config["github.com/sourcemint/bundler-js/0/-meta/config/0"].adapter, "bundler");

			return Q.when((typeof bundlerAdapter.remapSources === "function")?bundlerAdapter.remapSources(sourceReport):sourceReport).then(function(mappedReport)
			{
				masterReport.mappedReport = mappedReport;
				
				if (masterReport.mappedReport.bundleLoader === true) {
				    masterReport.bundleReport.bundleLoader = true;
				}

				if (typeof masterReport.bundleReport.bundleLoader !== "undefined") {
                    self.bundle.setBundleLoader(masterReport.bundleReport.bundleLoader, {
                        // TODO: Set bundleUrlPrefix and add path of a parent bundle if applicable.
                        bundleUrlPrefix: ""
                    });
				}

				var bundlePath = self.distributionPath + ".js";

				masterReport.bundleReport.mainBundle = bundlePath;
			    

			    if (typeof bundlerAdapter.getBundleHeader === "function")
				{
			        self.bundle.setBundleHeader(bundlerAdapter.getBundleHeader());
				}

                var done = Q.ref();

				UTIL.forEach(masterReport.mappedReport.packages, function(pkg)
				{
					done = Q.when(done, function()
					{
						return bundlePackage(pkg, {
							bundler: self,
							bundle: self.bundle,
							bundlePath: bundlePath
						});
					});
				});

				return Q.when(done, function()
				{
					packageDescriptors.forEach(function(packageDescriptor) {
						packageDescriptor();
					});
					
				}, function(err)
				{
					throw err;
				});

			}).then(function()
			{
				var done = Q.ref();

				UTIL.forEach(dynamicLoadBundles, function(dynamicLoadBundle)
				{
					done = Q.when(done, function()
					{
						var options = UTIL.deepCopy(self.options);
						options.mainModule = dynamicLoadBundle[1].uri;
						// We reset this as all sub-bundles will have been deleted already when our bundle was deleted.
                        options.forceCompleteBuild = false;
                        options.defaultDescriptor = dynamicLoadBundle[1].defaultDescriptor || {};
                        options.existingModules = UTIL.values(masterReport.bundleReport.modules);
                        // We reset this as sub-bundles always assume the loader is there (if the loader is needed a declaration should be placed in package.json).
                        options.bundleLoader = false;

						var distPath = self.distributionPath;
						if (dynamicLoadBundle[1].pkgNamespace) {
							distPath += "/" + dynamicLoadBundle[1].pkgNamespace;
						}
						distPath += "/" + dynamicLoadBundle[1].uri.replace(/\.js$/, "");
						if (!PATH.existsSync(PATH.dirname(distPath))) {
							WRENCH.mkdirSyncRecursive(PATH.dirname(distPath), 0775);
						}
						
						distPath = PATH.normalize(distPath);

						return Q.when(Bundler(dynamicLoadBundle[1].packagePath || self.packagePath, distPath, options).generateBundles());
					});
				});

				return done;
			}).then(function()
			{
			    self.bundle.setReport(masterReport);

			    return self.bundle.save();
			});
		});
	});
}
