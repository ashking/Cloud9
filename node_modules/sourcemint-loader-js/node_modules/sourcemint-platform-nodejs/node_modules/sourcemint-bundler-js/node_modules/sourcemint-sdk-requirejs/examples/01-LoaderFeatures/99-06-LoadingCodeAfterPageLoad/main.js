
// @see http://requirejs.org/docs/api.html#afterload

define(function(require, exports, module)
{
    var Q;

    exports.main = function(options)
    {
        Q = require.API.Q;
        
        var result = Q.defer();

        module.log("Hello from 99-06-LoadingCodeAfterPageLoad!");

        var extraModuleID = "./ExtraModule";

        require([extraModuleID], function(EXTRA_MODULE)
        {
            EXTRA_MODULE.init().then(result.resolve, result.reject);
        });

        return result.promise;
    }

    exports.getExtraModuleGreeting = function()
    {
        var result = Q.defer();

        var extraModuleID = "pkg/hello";

        require([extraModuleID], function(EXTRA_MODULE)
        {
            result.resolve(EXTRA_MODULE.getHello() + " from 99-06-LoadingCodeAfterPageLoad/ExtraModule!");
        });

        return result.promise;
    }
});
