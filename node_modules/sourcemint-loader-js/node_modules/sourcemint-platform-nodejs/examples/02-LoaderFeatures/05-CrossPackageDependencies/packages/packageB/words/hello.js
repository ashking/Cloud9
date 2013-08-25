
var GREETINGS = require("package/greetings");

exports.getWord = function()
{
	return require("letters/H").getLetter() + "ello";
}

exports.getName = function()
{
	return GREETINGS.getName();
}
