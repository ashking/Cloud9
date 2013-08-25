
const MODULE = require("module");



exports.getIncludedFiles = function() {
	var paths = [];
	for (var path in MODULE._cache) {
		paths.push(path);
	}
	return paths;
}

