
var LOADER = require("sourcemint-platform-nodejs/loader"),
	ERROR = require("sourcemint-platform-nodejs/lib/util/error"),
	BUNDLER = require("sourcemint-platform-browser/lib/bundler"),
	EXAMPLES = require("sourcemint-loader-js/tests/examples"),
	PATH = require("path"),
	FS = require("fs"),
	Q = require("q");


exports.main = function()
{
	var done = Q.ref();
	
	var basePath = __dirname + "/../02-LoaderFeatures";

	FS.readdirSync(basePath).forEach(function(filename)
	{
		var exampleBasePath = basePath + "/" + filename;

		if (PATH.existsSync(exampleBasePath + "/package.json"))
		{
			done = Q.when(done, function()
			{
				return Q.when(BUNDLER.bundle(exampleBasePath, __dirname + "/dist", {
					packageIdHashSeed: "__TEST__",
					forceCompleteBuild: true
				}), function()
				{
					// TODO: Only do this if running in strict mode.					
					/*
					if (filename === "Avoid-VariableRequire")
					{
						// This example should have thrown and marked as successful below.
						throw new Error("The 'Avoid-VariableRequire' example should have thrown!");
					}
					*/
				},
				function(err)
				{
					// TODO: Only do this if running in strict mode.					
					/*
					if (filename === "Avoid-VariableRequire")
					{
						// We ignore the error as we expect it to throw if successful.
					}
					else
					{
						throw err;
					}
					*/
					throw err;
				});
			});
		}
	});

	return done.then(function()
	{
		return EXAMPLES.main({
			LOADER: LOADER
		}, {
			uris: FS.readdirSync(__dirname + "/dist").filter(function(filename)
				{
					return FS.statSync(__dirname + "/dist/" + filename).isFile();
				}).map(function(filename)
				{
					return __dirname + "/dist/" + filename;
				})
		});
	});
}


if (require.main === module) {
	exports.main().fail(ERROR.logError);
}

