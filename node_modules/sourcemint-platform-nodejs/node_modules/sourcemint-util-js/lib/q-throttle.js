/**
 * Copyright: 2012 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 * Source: https://gist.github.com/1725325
 * 
 * NodeJS Example:
 * 
 *     // Requirements: `npm install q`
 *     
 *     var Q = require("q");
 *     
 * 	   // Require this module (to add `Q.Throttle` to the `Q` API)
 *     Q.Throttle = require("q-throttle").Throttle;
 *     
 *     // Maximum of 3 unresolved promises at a time
 *     var throttle = Q.Throttle(3);
 *     
 *     for (var i=0 ; i < 10 ; i++) {
 *         throttle.when([i], function(i) {
 *             // Never more than 3 unresolved doDeferredWork() promises
 *             return doDeferredWork(i).then(function() {
 *             });
 *         });
 *     }
 *
 *     throttle.on("done", function()
 *     {
 *     });
 *
 */


var Q = require("q"),
	EVENTS = require("events");


var Throttle = exports.Throttle = function(max)
{
	if (!(this instanceof Throttle))
        return new Throttle(max);

	this.count = 0;
	this.buffer = [];
	this.max = max;
};
Throttle.prototype = new EVENTS.EventEmitter();
Throttle.prototype.when = function(args, func)
{
	var self = this,
		result;

	if (self.count >= self.max)
	{
		self.buffer.push([args, func]);
		return;
	}
	self.count += 1;

	result = func.apply(null, args);
	
	if (!Q.isPromise(result))
	{
		throw new Error("Throttled function call did not return a promise!");
	}

	Q.when(result, function()
	{
		self.count -= 1;
		if (self.buffer.length > 0)
		{
			var info = self.buffer.shift();
			self.when(info[0], info[1]);
		}
		else
		if (self.count === 0)
		{
			self.emit("done");
		}
	}, function(err)
	{
		self.emit("error", err);
	});
}


exports.Throttle_Test = function()
{
	var deferred = Q.defer();
	
	try
	{	
		// Maximum of 3 unresolved promises at a time
		var throttle = new Throttle(3),
			list = [],
		    i,
		    count = 0;
		
		console.log("Running Throttle_Test:");

		for (i=0 ; i < 10 ; i++)
		{
			list.push(function()
			{
				return Q.delay(200 + (100 * i%3/10));
			});
		}

		for (i=0 ; i < list.length ; i++)
		{
			console.log("  triggering " + i);		
		    throttle.when([i], function(i)
		    {
		        // Only 3 unresolved promises will run at a time
		    	console.log("    starting " + i);
		    	count += 1;
		    	if (count > 3) throw new Error("More than 3 unresolved promises at the same time!");
		        return list[i]().then(function()
		        {
			    	console.log("      " + i + " done");
			    	count -= 1;
		        });
		    });
		}

		console.log("  triggering done");		
	
		throttle.on("done", function()
		{
			console.log("Throttle_Test OK!");
			deferred.resolve();
		});
	}
	catch(e)
	{
		deferred.reject(e);
	}

	return deferred.promise;
}
