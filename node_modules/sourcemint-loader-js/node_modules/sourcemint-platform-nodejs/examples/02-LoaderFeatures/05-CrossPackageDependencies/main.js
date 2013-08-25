
// One-way dependency.
var GREETINGS = require("helpers/greetings"),
	LOGGER = require("helpers/logger");

exports.main = function(options)
{
	LOGGER.log(GREETINGS.getGreeting());
}
