
exports.main = function()
{
    postMessage({type: "log", data: "Hello from Worker-Package!"});

    require.async("./sub-module", function(SUB_MODULE)
    {
        SUB_MODULE.main();
    });
}
