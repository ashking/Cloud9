
var Q = require("q"),
    ERROR = require("sourcemint-platform-nodejs/lib/util/error");


exports.main = function()
{
    var deferred = Q.defer();
    
    // TODO: Implement tests
    
    deferred.resolve();

    return deferred.promise;
}


if (require.main === module)
{
    Q.call(exports.main).fail(ERROR.exitProcessWithError);
}
