
var LOADER = require("sourcemint-platform-nodejs/lib/loader"),
	ERROR = require("sourcemint-platform-nodejs/lib/util/error"),
	BUNDLER = require("sourcemint-platform-nodejs/lib/bundler"),
	PATH = require("path"),
	FS = require("fs"),
	Q = require("q");


exports.main = function()
{
	var done = Q.ref();
	
	var basePath = __dirname + "/../04-PlatformFeatures";

	FS.readdirSync(basePath).forEach(function(filename)
	{
	    // TODO: Get this working in bundled format.
	    if (filename === "02-BundlerMiddleware" ||
            filename === "03-BundlerMiddlewareBundleLoader") {
	        return;
	    }

		var exampleBasePath = basePath + "/" + filename;

		if (PATH.existsSync(exampleBasePath + "/package.json"))
		{
			done = Q.when(done, function()
			{
				return BUNDLER.bundle(exampleBasePath, __dirname + "/dist", {
					packageIdHashSeed: "__TEST__",
                    forceCompleteBuild: true
				});
			});
		}
	});

	return done.then(function()
	{
		var done = Q.ref();
		
		FS.readdirSync(__dirname + "/dist").filter(function(filename)
		{
			return FS.statSync(__dirname + "/dist/" + filename).isFile();
		}).map(function(filename)
		{
			return __dirname + "/dist/" + filename;
		}).forEach(function(uri)
		{
			done = Q.when(done, function()
			{
				return bootBundle(uri);
			});
		});
		
		return done;
	});
}

function bootBundle(uri)
{
	var deferred = Q.defer();

	console.log("Booting bundle: " + uri);

	LOADER.sandbox(uri, function(sandbox)
	{
		try {
			Q.when(sandbox.main(), deferred.resolve, deferred.reject);
		} catch(e) {
			deferred.reject(e);
		}
	}, {
		onInitModule: function(moduleInterface, moduleObj)
		{
			moduleObj.require.API = {
				Q: Q
			};
		}
	});

	return deferred.promise;
}


if (require.main === module) {
	exports.main().fail(ERROR.logError);
}

