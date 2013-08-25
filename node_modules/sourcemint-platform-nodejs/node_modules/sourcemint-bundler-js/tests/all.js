
var Q = require("q"),
    ERROR = require("sourcemint-platform-nodejs/lib/util/error");


exports.main = function()
{
    return Q.call(require("./bundle").main);
}


if (require.main === module)
{
    Q.call(exports.main).fail(ERROR.exitProcessWithError);
}
