
// Circular dependency.
var GREETINGS = require("../greetings");

exports.getWord = function()
{
	return "Hello";
}

exports.getName = function()
{
	return GREETINGS.getName();
}
