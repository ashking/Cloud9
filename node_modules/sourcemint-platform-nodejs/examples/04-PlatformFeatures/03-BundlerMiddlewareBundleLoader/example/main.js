
exports.main = function()
{
    console.log("Hello from Example!");
    
    require.async("./sub-module", function(SUB_MODULE)
    {
        SUB_MODULE.main();
        
        require.sandbox("../sub-package.js", function(sandbox)
        {
            sandbox.main();
        });
    });

    // TODO: Get this working in tests. Could work with http://www.phantomjs.org/ ?
    if (typeof Worker === "undefined") return;

    var worker = new Worker("/bundles/worker-package.js");
    
    worker.onerror = function()
    {
        console.error.apply(null, arguments);
    }

    worker.onmessage = function(msg)
    {
        if (msg.data.type === "log") {
            console.log(msg.data.data);
        }
    }
}