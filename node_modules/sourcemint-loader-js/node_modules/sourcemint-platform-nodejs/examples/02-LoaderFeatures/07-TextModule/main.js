
var TEXT = require("./hello.txt");

exports.main = function(options)
{
	TEXT = TEXT.replace(" \\ \" 0 - _ . ! ~ * ' ( ) ; , / ? : @ & = + $", "");

	if (TEXT.length != 5)
	{
		throw new Error("Text was not decoded properly!");
	}

	module.log(TEXT + " from 07-TextModule!");
}
