
var LOADER = require("sourcemint-platform-nodejs/lib/loader"),
	ERROR = require("sourcemint-platform-nodejs/lib/util/error"),
	EXAMPLES = require("sourcemint-loader-js/tests/examples");


exports.main = function()
{
	return EXAMPLES.main({
		LOADER: LOADER
	});
}


if (require.main === module) {
	exports.main().fail(ERROR.logError);
}
