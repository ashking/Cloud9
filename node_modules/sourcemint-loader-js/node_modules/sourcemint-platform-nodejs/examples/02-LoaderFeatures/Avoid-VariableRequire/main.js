
exports.main = function()
{
	var moduleId = "./lib";

	// TODO: This should throw if running in strict mode!
	var obj = require(moduleId);

	module.log(obj.main());
}
