
var GLOB = require("glob");

for (var key in GLOB) {
    exports[key] = GLOB[key];
}
