
var HELPER = require("../../../tests/test-helper"),
	ASSERT = require("assert"),
	HTTP = require("http");


HELPER.makeTest(require, exports, module, function(Q, onTestDoneDeferred, options)
{
	HTTP.get({
		host: "127.0.0.1",
		port: options.port,
		path: "/"
	}, function(res)
	{
		var data = "";
		
		res.on("data", function(chunk)
		{
			data += chunk.toString();
		});
		
		res.on("end", function()
		{
			Q.call(function()
			{
				if (res.statusCode !== 200)
				{
					throw new Error("HTTP response status not 200!");
				}

				ASSERT.equal(data, "Hello from 02-ConnectServer", "HTTP response body did not match!");

				onTestDoneDeferred.resolve();

			}).fail(onTestDoneDeferred.reject);
		});		
	}).on("error", function(e)
	{
		Q.call(function()
		{
			throw new Error("Error making HTTP request: " + e.message);
		}).fail(onTestDoneDeferred.reject);
	});
});
