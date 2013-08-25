
// @see http://requirejs.org/docs/api.html#defdep

define(["module", "./word"], function(module, WORD)
{
    return {
        main: function(options)
        {
            module.log(WORD.word + " from 99-03-DefinitionFunctionsWithDependencies!");
        }
    };
});
