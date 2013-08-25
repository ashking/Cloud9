
var LOADER = require("sourcemint-platform-nodejs/lib/loader"),
	ERROR = require("sourcemint-platform-nodejs/lib/util/error"),
	BUNDLER = require("sourcemint-sdk-requirejs/lib/bundler"),
	EXAMPLES = require("sourcemint-loader-js/tests/examples"),
	PATH = require("path"),
	FS = require("fs");


exports.main = function()
{
	var done = Q.ref();
	
	var basePath = __dirname + "/../01-LoaderFeatures";

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
			        if (/\.manifest\.json$/.test(filename)) return false;
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

