
exports.main = function()
{
    postMessage({type: "log", data: "Hello from Worker-Package Sub-Module!"});
}
