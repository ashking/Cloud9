
var LOADER = require("./lib/loader");

for (var name in LOADER)
    exports[name] = LOADER[name];
