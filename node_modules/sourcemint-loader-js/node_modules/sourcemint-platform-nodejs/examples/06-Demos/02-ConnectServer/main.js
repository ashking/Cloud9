
var CONNECT = require("connect");


exports.main = function(onReadyDeferred, options)
{
	var server = CONNECT();

	server.use(CONNECT.router(function(app)
	{
		app.get("/", function (req, res)
		{
		    res.writeHead(200, {
		    	"Content-Type": "text/plain"
		    });
		    res.end("Hello from 02-ConnectServer");
		});
	}));

	/*TEST*/ if (onReadyDeferred) {
	/*TEST*/     server.once("listening", function() {
	/*TEST*/         onReadyDeferred.resolve(function onTestDone(stoppedCallback) {
	/*TEST*/ 		     server.once("close", function() {
	/*TEST*/ 			     stoppedCallback();
	/*TEST*/ 		     });
	/*TEST*/ 		     server.close();
	/*TEST*/ 	     });
	/*TEST*/     });
	/*TEST*/ }

	server.listen(options.port, "127.0.0.1");

	console.log("Server running at http://127.0.0.1:" + options.port + "/");
}

if (require.main === module) {
	exports.main(null, {
		port: 1337
	});
}
