
// @see http://requirejs.org/docs/api.html#cjsmodule

define(function(require, exports, module)
{
    var WORD = require("./word");

    exports.main = function(options)
    {
        module.log(WORD() + " from 99-05-DefineAModuleWithSimplifiedCommonJSWrapper!");
    };
});
