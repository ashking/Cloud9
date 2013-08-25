
// @see http://requirejs.org/docs/api.html#funcmodule

define(["module", "./word"], function(module, WORD)
{
    return {
        main: function(options)
        {
            module.log(WORD() + " from 99-04-DefineaModuleAsAFunction!");
        }
    };
});
