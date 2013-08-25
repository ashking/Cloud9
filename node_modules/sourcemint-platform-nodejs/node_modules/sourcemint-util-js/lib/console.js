
exports.enableFileLineInfo = function() {

	// See: https://github.com/LearnBoost/console-trace
	require("console-trace")({
	    always: true,
	    colors: true
	});

}
