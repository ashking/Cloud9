
var TERM = require("./term");
var UTIL = require("./util");


exports.print = function(error, options) {
    try {
        options = options || {};
        options.severity = options.severity || "ERROR";
        
        var color = (options.severity=="ERROR")?
                        "red" :
                        (options.severity=="WARN")?
                            "orange":"white";    
    
        var output = {
            header: [],
            stack: [],
            footer: []
        };
    
        var type = false;
        var message = ((typeof error.message !="undefined")?error.message:(""+error));
        var file = error.file || error.fileName || false;
        var line = error.line || error.lineNumber || false;
        var col = false;
    
    
        if(error.stack) {
            output.stack.push("  \0"+color+"(*\0) Stack:");
            var count = 0;
            UTIL.forEach(error.stack.split("\n"), function(frame) {
                if (frame === "Error: " + message) return;
                if (frame === "ReferenceError: " + message) {
                    type = "reference";
                    return;
                }
                if (frame === "TypeError: " + message) {
                    type = "type";
                    return;
                }
                if (frame === "AssertionError: " + message) {
                    type = "assertion";
                    return;
                }
                count++;
                if (count === 1) {
                    var m = frame.match(/^\s*at (?:[\S\s]+\s)?\(?([^:]*):(\d*):(\d*)\)?$/);
                    if (m) {
                        if (file === false && line === false) {
                            file = m[1];
                            line = m[2];
                            col = m[3];
                            return;
                        } else
                        if (file === m[1] && line === m[2]) {
                            return;
                        }
                    }
                }
                output.stack.push("  \0"+color+"(*\0)    " + frame);
            });
        } else
        if(error.rhinoException) {
            output.stack.push("  \0"+color+"(*\0) Rhino Exception:");
            UTIL.forEach(error.rhinoException.getScriptStackTrace().split("\n"), function(line) {
                output.stack.push("  \0"+color+"(*\0)        " + line);
            });
        }
        
        output.header.push("  \0"+color+"(* "+options.severity+" ***************************************************************************\0)");
        output.header.push("  \0"+color+"(*\0) Error: \0"+color+"(\0bold(" + message + ((type !== false)?(" (" + type + ")"):"") + "\0)\0)");
        if (typeof error.code !== "undefined") {
            output.header.push("  \0"+color+"(*\0) Code : \0"+color+"(\0bold(" + error.code + "\0)\0)");
        }
        output.header.push("  \0"+color+"(*\0) File : \0cyan(\0bold(" + file + "\0)\0)" + "\0yellow( @ \0bold(" + line + "\0)" + ((col !== false)?(" : " + col):"") + "\0)");    
        

/*
        if(INCLUDE_NOTES && error.notes) {
            TERM.stdout.writenl("  \0"+color+"(*\0) Notes:");
            
            // TODO: Use better dumper to catch circular references etc...
            var dump = JSDUMP.parse(error.notes);
            
            UTIL.forEach(dump.split("\n"), function(line) {
                TERM.stdout.writenl("  \0"+color+"(*\0)        " + line);
            });
        }
*/
        output.footer.push("  \0"+color+"(* "+options.severity+" ***************************************************************************\0)");    
    
        output.header.concat(output.stack).concat(output.footer).map(TERM.stdout.writenl);

    } catch(err) {
        console.error("Error printing error: ", err.stack);
    }
}
