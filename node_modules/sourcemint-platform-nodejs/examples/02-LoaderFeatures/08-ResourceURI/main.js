
exports.main = function(options)
{
	var deferred = require.API.Q.defer();

	// NOTE: You can also use `require.resolve()` instead of `require.id()`.
	//       We use the latter so we can load this module in the browser as well.
	//       (The browser loader only supports `require.id()` out of the box)
	var uri = require.sandbox.id + require.id("./hello.txt");

	require.API.JQUERY(function($)
	{
		$.get(uri, function(data)
		{
			require.API.Q.call(function()
			{
				if (data !== "Hello")
				{
					throw new Error("Loaded resource does not have correct content!");
				}

				module.log(data + " from 08-ResourceURI!");

			}).then(deferred.resolve, deferred.reject);
		});
	});
	
	return deferred.promise;
}
