
// @see http://requirejs.org/docs/api.html#deffunc

define(function(require, exports, module)
{
    var WORD = require("./word").word;

    exports.main = function(options)
    {
        module.log(WORD + " from 99-02-DefinitionFunctions!");
    }
});
