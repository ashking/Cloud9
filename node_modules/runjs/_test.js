var run = require('./run.js');

run.reflector();
/*
var s = Date.now();
while(1){
    var n = Date.now();
    if(n - s > 1000) break;
}
*/
console.log("STARTUP COMPLETE");

setInterval(function(){
    console.log("OK");
},500)

