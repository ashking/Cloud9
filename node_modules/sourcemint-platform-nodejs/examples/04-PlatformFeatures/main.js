
var ERROR = require("sourcemint-platform-nodejs/lib/util/error"),
	EXEC = require("child_process").exec;
	PATH = require("path"),
	FS = require("fs"),
	Q = require("q");


exports.main = function()
{
	var done = Q.ref();
	
	var basePath = __dirname;

	FS.readdirSync(basePath).forEach(function(filename)
	{
		var exampleBasePath = basePath + "/" + filename;

		if (PATH.existsSync(exampleBasePath + "/package.json"))
		{
			done = Q.when(done, function()
			{
				return runExample(exampleBasePath);
			});
		}
	});

	return done;
}

function runExample(path)
{
	var deferred = Q.defer();

	console.log("Running example: " + path);

	EXEC("npm install", {
		cwd: path
	}, function(error, stdout, stderr)
	{
        if (error) {
        	console.error(stderr);
        	deferred.reject(new Error("Error running: npm install (cwd: " + path + ")"));
		} else {

			process.stdout.write(stdout);

			EXEC("npm test", {
				cwd: path
			}, function(error, stdout, stderr)
			{
		        if (error) {
		        	console.error(stderr);
		        	deferred.reject(new Error("Error running: npm test (cwd: " + path + ")"));
		        } else {					
					process.stdout.write(stdout);
					deferred.resolve();
				}
			});
		}
	});

	return deferred.promise;
}


if (require.main === module) {
	exports.main().fail(ERROR.logError);
}

