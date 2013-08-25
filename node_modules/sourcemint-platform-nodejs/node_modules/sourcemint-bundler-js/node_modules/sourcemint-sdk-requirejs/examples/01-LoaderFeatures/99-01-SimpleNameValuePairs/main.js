
// @see http://requirejs.org/docs/api.html#defsimple

define(function(require, exports, module)
{
    var WORD = require("./word").word;

    exports.main = function(options)
    {
        module.log(WORD + " from 99-01-SimpleNameValuePairs!");
    }
});
