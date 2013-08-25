
// One-way dependency.
var GREETINGS = require("./greetings");

exports.main = function(options)
{
	module.log(GREETINGS.getGreeting());
};
