
define(function(require, exports, module)
{
    var MAIN = require("./main.js");

    exports.init = function()
    {
        return MAIN.getExtraModuleGreeting().then(function(msg)
        {
            module.log(msg);
        });
    }
});
