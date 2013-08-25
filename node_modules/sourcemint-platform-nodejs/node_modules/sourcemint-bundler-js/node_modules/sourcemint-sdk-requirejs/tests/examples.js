
var EXAMPLES = require("sourcemint-platform-nodejs/tests/examples"),
    ERROR = require("sourcemint-platform-nodejs/lib/util/error");


exports.main = EXAMPLES.main;

exports.extraExamples = [
    "03-SDKFeatures/01-BundlerMiddleware"
];

if (require.main === module) {
    exports.main({
        packageBasePath: __dirname + "/..",
        extraExamples: exports.extraExamples
    }).fail(ERROR.exitProcessWithError);
}
