
var LOADER = require("sourcemint-platform-nodejs/lib/loader"),
	ERROR = require("sourcemint-platform-nodejs/lib/util/error"),
	BUNDLER = require("sourcemint-platform-nodejs/lib/bundler"),
	PATH = require("path"),
	FS = require("fs"),
	Q = require("q"),
	VM = require("vm");


exports.main = function()
{
	var done = Q.ref();
	
	var basePath = __dirname + "/../06-Demos";

	FS.readdirSync(basePath).forEach(function(filename)
	{
		var exampleBasePath = basePath + "/" + filename;

		if (PATH.existsSync(exampleBasePath + "/package.json"))
		{
			done = Q.when(done, function()
			{
				return BUNDLER.bundle(exampleBasePath, __dirname + "/dist", {
					packageIdHashSeed: "__TEST__",
                    forceCompleteBuild: true
				}).then(function() {
					return BUNDLER.bundle(exampleBasePath, __dirname + "/dist-bundled-loader", {
						packageIdHashSeed: "__TEST__",
	                    forceCompleteBuild: true,
						bundleLoader: true
					});
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
			return [
				__dirname + "/dist/" + filename,
				__dirname + "/dist-bundled-loader/" + filename,
				basePath + "/" + filename.replace(/\.js$/, "") + "/test.js"
			];
		}).forEach(function(uris)
		{
			done = Q.when(done, function()
			{
				return bootBundle(uris[0], uris[2]);
			});
			done = Q.when(done, function()
			{
				return runBundle(uris[1], uris[2]);
			});
		});
		
		return done;
	});
}

function bootBundle(uri, testUri)
{
	var deferred = Q.defer();

	console.log("Booting bundle: " + uri);

	LOADER.sandbox(uri, function(sandbox)
	{
		try {
		
			Q.when(require(testUri).main(sandbox.main), deferred.resolve, deferred.reject);

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

function runBundle(uri, testUri)
{
	var deferred = Q.defer();

	console.log("Running bundle: " + uri);

	try {
	
		Q.when(require(testUri).main(require(uri).main), deferred.resolve, deferred.reject);

	} catch(e) {
		deferred.reject(e);
	}

	return deferred.promise;
}


if (require.main === module) {
	exports.main().fail(ERROR.logError);
}

