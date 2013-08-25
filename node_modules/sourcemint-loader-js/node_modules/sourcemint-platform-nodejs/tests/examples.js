
var Q = require("q"),
	PATH = require("path"),
	FS = require("fs"),
	EXEC = require("child_process").exec,
	UTIL = require("n-util"),
	ERROR = require("../lib/util/error");

exports.main = function(options)
{
    const PACKAGE_BASE_PATH = FS.realpathSync(options.packageBasePath);
    const EXAMPLES_BASE_PATH = PACKAGE_BASE_PATH + ((typeof options.examplesPath !== "undefined")?options.examplesPath:"/examples");

    var RELATIVE_PATH = "/..";
    if (typeof options.examplesPath !== "undefined") {
        if (options.examplesPath === "") {
            RELATIVE_PATH = "";
        } else {
            throw new Error("NYI");
        }
    }

	return linkPackages().then(function(packages)
	{
		var done = Q.ref();

		packages.forEach(function(packageName)
		{
			done = Q.when(done, function()
			{
				return installMissingDependencies(EXAMPLES_BASE_PATH + "/" + packageName).then(function()
				{
				    if (options.run === false) return;

				    console.log("Running example: " + EXAMPLES_BASE_PATH + "/" + packageName);

					return require(EXAMPLES_BASE_PATH + "/" + packageName + "/main.js").main().fail(function(err) {
					    ERROR.logError(err);
					    throw err;
					});
				});
			});
		});
		
		return done;
	});

	function installMissingDependencies(packageRootPath)
	{
	    var deferred = Q.defer();

	    EXEC("npm install", {
	        cwd: packageRootPath
	    }, function(err, stdout, stderr)
	    {
	        if (err) deferred.reject(err);
	        else if (stderr) deferred.reject(stderr)
	        else {
	            process.stdout.write(stdout);
	            deferred.resolve();
	        }
	    });

	    return deferred.promise;
	}

	function linkPackages()
	{
	    var packages = [];

	    if (!PATH.existsSync(PACKAGE_BASE_PATH + "/node_modules"))
	    {
	        FS.mkdirSync(PACKAGE_BASE_PATH + "/node_modules", 0775);
	    }

        var ourDescriptor = JSON.parse(FS.readFileSync(PACKAGE_BASE_PATH + "/package.json"));

	    FS.readdirSync(EXAMPLES_BASE_PATH).concat(options.extraExamples || []).forEach(function(filename)
	    {
	        var basePath = EXAMPLES_BASE_PATH + "/" + filename;

	        if (PATH.existsSync(basePath + "/package.json"))
	        {
	            if (filename.split("/").length === 1) {
	                packages.push(filename);
	            }

	            var descriptor = JSON.parse(FS.readFileSync(basePath + "/package.json"));

	            if (!PATH.existsSync(basePath + "/node_modules"))
	            {
	                FS.mkdirSync(basePath + "/node_modules", 0775);
	            }

	            var deps = descriptor.devDependencies || {};
	            UTIL.update(deps, descriptor.dependencies || {});
	            Object.keys(deps).forEach(function(name)
	            {
	                if (name === ourDescriptor.name ||
	                    (ourDescriptor.dependencies && ourDescriptor.dependencies[name] === deps[name]) ||
	                    (ourDescriptor.devDependencies && ourDescriptor.devDependencies[name] === deps[name])
	                ) {
	                    
	                    if (name === ourDescriptor.name)
	                    {
	                        try {
	                            // TODO: Find a symlink test that does not throw if it does not exist.
	                            FS.lstatSync(basePath + "/node_modules/" + name);
	                        } catch(e) {
	                            FS.symlinkSync(filename.replace(/[^\/]+/g, "..") + RELATIVE_PATH + "/..", basePath + "/node_modules/" + name);
	                        }
	                    }
	                    else
	                    {
	                        try {
	                            // TODO: Find a symlink test that does not throw if it does not exist.
	                            FS.lstatSync(basePath + "/node_modules/" + name);
	                        } catch(e) {
	                            FS.symlinkSync(filename.replace(/[^\/]+/g, "..") + RELATIVE_PATH + "/../node_modules/" + name, basePath + "/node_modules/" + name);
	                        }
	                    }
	                }
	            });
	        }
	    });

	    return Q.call(function() {
	        return packages;
	    });
	}	
}

exports.extraExamples = [
    "04-PlatformFeatures/02-BundlerMiddleware",
    "04-PlatformFeatures/03-BundlerMiddlewareBundleLoader"
];

if (require.main === module) {
	exports.main({
	    packageBasePath: __dirname + "/..",
	    extraExamples: exports.extraExamples
	}).fail(ERROR.exitProcessWithError);
}
