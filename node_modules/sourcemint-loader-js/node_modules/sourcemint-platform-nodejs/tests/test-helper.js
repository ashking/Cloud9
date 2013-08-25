
var Q = require("q"),
	HTTP = require("http"),
	ERROR = require("../lib/util/error");


exports.makeTest = function(REQUIRE, EXPORTS, MODULE, testCallback)
{
	EXPORTS.main = function(MAIN)
	{
		if (typeof MAIN === "undefined") {
			MAIN = REQUIRE("./main").main;
		}

		var deferred = Q.defer();

		getFreePort().then(function(port)
		{
			var onReadyDeferred = Q.defer(),
				options = {
					port: port
				};

			MAIN(onReadyDeferred, options);
			
			Q.when(onReadyDeferred.promise, function(onTestDoneCallback)
			{
				var testDoneDeferred = Q.defer();

				testCallback(Q, testDoneDeferred, options);
				
				return Q.when(testDoneDeferred.promise, function()
				{
					onTestDoneCallback(function stopped()
					{
						deferred.resolve();
					});
				});

			}).fail(deferred.reject);
		}).fail(deferred.reject);

		return deferred.promise;
	}

	if (REQUIRE.main === MODULE) {
		EXPORTS.main().fail(function(err) {
		    ERROR.logError(err);

		    // TODO: Get rid of this once we know why the event loop sometimes hangs on error.
	        process.exit(0);
		});
	}
}

function getFreePort(port)
{
	var deferred = Q.defer();

	port = port || 1337;

	var server = HTTP.createServer();

	server.on("listening", function()
	{
		server.close();
		deferred.resolve(port);
	});

	server.on("error", function()
	{
		deferred.resolve(getFreePort(port + 1));
	});

	server.listen(port, "127.0.0.1");
	
	return deferred.promise;
}
