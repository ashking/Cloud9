
define(function(require, exports, module)
{
    var TEXT1 = require("text!./hello.js"),
        TEXT2 = require("text!./hello.txt");

    exports.main = function(options)
    {
        var TEXT = TEXT1 + TEXT2.replace(" \\ \" 0 - _ . ! ~ * ' ( ) ; , / ? : @ & = + $", "");

        if (TEXT.length != 5)
        {
            throw new Error("Text was not decoded properly!");
        }

        module.log(TEXT + " from 07-TextModule!");
    }
});
