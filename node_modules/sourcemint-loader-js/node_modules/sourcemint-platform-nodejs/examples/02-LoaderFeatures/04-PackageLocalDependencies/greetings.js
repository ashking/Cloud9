
// Circular dependency.
var HELLO = require("./words/hello");

exports.getGreeting = function()
{
	return HELLO.getWord() + " from " + HELLO.getName() + "!";
}

exports.getName = function()
{
	return "04-PackageLocalDependencies";
}
