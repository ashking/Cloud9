
exports.main = function(options)
{			
	module.log("Hello from 12-Environment!");
	
	if (module.id !== "/main.js")
	{
		throw new Error("`module.id` has incorrect value!");
	}
	
	if (typeof require !== "function")
	{
		throw new Error("`require` is not a function!");
	}

	if (typeof require.id !== "function")
	{
		throw new Error("`require.id` is not a function!");
	}

	if (typeof require.async !== "function")
	{
		throw new Error("`require.async` is not a function!");
	}

	if (typeof require.sandbox !== "function")
	{
		throw new Error("`require.sandbox` is not a function!");
	}
	
	if (typeof require.sandbox.id !== "string")
	{
		throw new Error("`require.sandbox.id` is not a string!");
	}
}
