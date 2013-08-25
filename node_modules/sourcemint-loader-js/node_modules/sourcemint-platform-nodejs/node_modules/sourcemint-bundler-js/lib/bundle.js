
var Q = require("q"),
    PATH = require("path"),
    FS = require("fs"),
    UTIL = require("n-util");

const LOADER_PATH = require.resolve("sourcemint-loader-js/loader.js");


var bundles = {};

exports.forPath = function(path)
{
    if (!bundles[path]) {
        var deferred = Q.defer();
        bundles[path] = deferred.promise;
        var bundle = new Bundle(path);
        bundle.open().then(function(didLoadOk)
        {
            deferred.resolve([bundle, didLoadOk]);
        }, function(err)
        {
            deferred.reject(err);
        });
    }
    return bundles[path];
}


var Bundle = exports.Bundle = function(path)
{
    this.path = path;
    this.mtime = 0;
    this.header = ["", {}];
    this.descriptors = {};
    this.modules = {};
    this.report = {};
    this.bundleLoader = [false, {}];
}

Bundle.prototype.reset = function()
{
    var self = this;
    return Q.call(function()
    {
        self.mtime = 0;
        self.header = [];
        self.descriptors = {};
        self.modules = {};
        self.report = {};
    });
}

Bundle.prototype.open = function()
{
    var self = this,
        deferred = Q.defer();
    PATH.exists(self.path, function(exists)
    {
       if (exists) {
           
           FS.stat(self.path, function(err, stats)
           {
               if (err) { deferred.reject(err); return; }

               self.mtime = stats.mtime.getTime();

               // TODO: Write read/write lock so bundle can only be opened once for writing.
               Q.ncall(FS.readFile, FS, self.path, "utf8").then(function(code)
               {
                   self.parseCode(code).then(function()
                   {
                       // DID load from disk.
                       deferred.resolve(true);
                   }, function(err)
                   {
                       console.log("WARNING: Error '" + err + "' parsing bundle: " + self.path, err.stack);
    
                       // Reset everything so we can generate a clean bundle.
                       self.reset().then(function()
                       {
                           // Did NOT load from disk.
                           deferred.resolve(false);
                       });
                   });
               }).fail(deferred.reject);
           });
       } else {
           self.save().then(function() {
               return self.open();
           }).then(deferred.resolve, deferred.reject);
       }
    });
    return deferred.promise;
}

Bundle.prototype.save = function()
{
    var self = this,
        deferred = Q.defer();

    FS.open(self.path, "w+", 0755, function(err, fd)
    {
        if (err) { deferred.reject(err); return; }

        Q.call(function()
        {
            return generateCode(fd);

        }).fail(deferred.reject).fin(function()
        {
            FS.close(fd, function(err) {
                if (err) { deferred.reject(err); return; }
                
                FS.stat(self.path, function(err, stats)
                {
                    if (err) { deferred.reject(err); return; }

                    self.mtime = stats.mtime.getTime();
                    deferred.resolve();
                });
            });
        });
    });
    
    function generateCode(fd)
    {
        return ((self.bundleLoader[0] === true)?writeLoader:writePayload)().then(function()
        {
            return writeFooter();
        });

        function write(str, position)
        {
            var deferred = Q.defer(),
                buffer = new Buffer(str, "utf8");
            if (typeof position === "undefined") position = null;
            FS.write(fd, buffer, 0, buffer.length, position, function(err, written, buffer)
            {
                if (err) { deferred.reject(err); return; }
                deferred.resolve(written);
            });
            return deferred.promise;
        }
        
        function writeLoader()
        {
            return write([
                '// @sourcemint-bundle-loader: ' + JSON.stringify(self.bundleLoader[1]),
                'var require, sourcemint;',
                '(function() {',
                '    var rootBundleLoader = function(uri, loadedCallback) {'
            ].join('\n') + '\n').then(function()
            {
                return writePayload().then(function()
                {
                    return write([
                        '// @sourcemint-bundle-ignore: ',
                        '        if (typeof loadedCallback === "function") loadedCallback();',
                        '    }',
                        '    function initLoader(exports) {'
                    ].join('\n') + '\n').then(function()
                    {
                        return Q.ncall(FS.readFile, FS, LOADER_PATH, "utf8").then(function(code)
                        {
                            return write(code).then(function()
                            {
                                if (self.bundleLoader[1].platformLoaderSource) {

                                    return Q.when(self.bundleLoader[1].platformLoaderSource, function(platformCode) {

                                        return write([
                                            '    };',
                                            '    if (typeof sourcemint === "undefined") {',
                                            '        sourcemint = {};',
                                            '        var LOADER_INJECTED = {};',
                                            '        initLoader(LOADER_INJECTED);',
                                            '        (function(require, exports) {',
                                            '            ' + platformCode,
                                            '        })(require, sourcemint);',
                                            '        var platformRequire = require;',
                                            '        var isMain = ((platformRequire && platformRequire.main === module)?true:false);',
                                            '        require = LOADER_INJECTED.require;',
                                            '        sourcemint.sandbox(((typeof __dirname !== "undefined")?__dirname:".") + "/' + ((self.bundleLoader[1].bundleUrlPrefix)?"/{host}"+self.bundleLoader[1].bundleUrlPrefix:"") + PATH.basename(self.path) + '", function(sandbox) {',
                                            '            if (typeof exports === "object") {',
                                            '                var mainExports = sandbox.boot();',
                                            '                if (typeof mainExports === "function") {',
                                            '                    module.exports = mainExports;',
                                            '                } else {',
                                            '                    for (var key in mainExports) {',
                                            '                        exports[key] = mainExports[key];',
                                            '                    }',
                                            '                }',
                                            '            } else {',
                                            '                sandbox.main();',
                                            '            }',
                                            '        }, {',
                                            '            rootBundleLoader: rootBundleLoader,',
                                            '            isMain: isMain',
                                            '        });',
                                            '    } else {',
                                            '        rootBundleLoader();',
                                            '    }',
                                            '})();',
                                        ].join('\n') + '\n');

                                    });

                                } else {
                                    return write([
                                        '    };',
                                        '    if (typeof sourcemint === "undefined") {',
                                        '        var exports = {};',
                                        '        initLoader(exports);',
                                        '        sourcemint = exports.require;',
                                        '        if (!require) require = sourcemint;',
                                        '        sourcemint.sandbox("' + ((self.bundleLoader[1].bundleUrlPrefix)?"/{host}"+self.bundleLoader[1].bundleUrlPrefix:"") + PATH.basename(self.path) + '", function(sandbox) {',
                                        '            sandbox.main();',
                                        '        }, {',
                                        '            rootBundleLoader: rootBundleLoader',
                                        '        });',
                                        '    } else {',
                                        '        rootBundleLoader();',
                                        '    }',
                                        '})();'                  
                                    ].join('\n') + '\n');
                                }
                            });
                        });
                    });
                });
            });
        }

        function writePayload()
        {
            return write('// @sourcemint-bundle-ignore: \nrequire.bundle("", function(require)\n{\n').then(function() {
                return write(generateHeader() + '\n').then(function() {
                    return write(generateModules() + '\n').then(function() {
                        return write(generateDescriptors() + '\n').then(function() {
                            return write('// @sourcemint-bundle-ignore: \n});\n');
                        });
                    });
                });
            });
        }

        function writeFooter()
        {
            var deferred = Q.defer();
            
            FS.fstat(fd, function(err, stats) {

                if (err) { deferred.reject(); return; }

                write('// @sourcemint-bundle-report: ' + JSON.stringify(self.report) + '\n').then(deferred.resolve, deferred.reject);
            });
            
            return deferred.promise;
        }
        
        function generateHeader()
        {
            return [
                '// @sourcemint-bundle-header: ' + JSON.stringify(self.header[1]),
                self.header[0]
            ].join("\n");
        }
        
        function generateModules()
        {
            var code = [];
            UTIL.forEach(self.modules, function(moduleInfo)
            {
                code.push('// @sourcemint-bundle-module: ' + JSON.stringify(moduleInfo[1][1]));
                code.push('require.memoize("' + moduleInfo[0] + '", ');
                code.push(moduleInfo[1][0]);
                code.push(');');
            });
            return code.join("\n");
        }

        function generateDescriptors()
        {
            var code = [];
            UTIL.forEach(self.descriptors, function(descriptorInfo)
            {
                code.push('// @sourcemint-bundle-descriptor: ' + JSON.stringify(descriptorInfo[1][1]));
                code.push('require.memoize("' + descriptorInfo[0] + '", ');
                code.push(descriptorInfo[1][0]);
                code.push(');');
            });
            return code.join("\n");
        }
    }

    return deferred.promise;
}

Bundle.prototype.setBundleLoader = function(flag, info)
{
    this.bundleLoader = [flag, info || {}];
}

Bundle.prototype.setBundleHeader = function(code, info)
{
    this.header = [code, info || {}];
}

Bundle.prototype.setDescriptor = function(id, code, info)
{
    id = id || info.id;
    info.id = id;
    this.descriptors[id] = [code, info];
}

Bundle.prototype.setModule = function(id, code, info)
{
    id = id || info.id;
    info.id = id;
    this.modules[id] = [code, info];
}

Bundle.prototype.setReport = function(obj)
{
    this.report = obj;
}

Bundle.prototype.parseCode = function(code)
{
    var self = this,
        deferred = Q.defer();

    try
    {
        var codeParts = code.split(/(?:^|\n)\s*\/\/\s*@(sourcemint-bundle-[^:]*)\s*:/),
            i,
            sectionParts;

        for (i = 1 ; i < (codeParts.length-1) ; i += 2)
        {
            sectionParts = codeParts[i+1].match(/^\s*([^\n]*)\s*(\n([\S\s]*))?$/);

            if (codeParts[i] === "sourcemint-bundle-ignore") {
                // Ignore.
            } else
            if (codeParts[i] === "sourcemint-bundle-header") {
                self.setBundleHeader(sectionParts[3], JSON.parse(sectionParts[1]));
            } else
            if (codeParts[i] === "sourcemint-bundle-loader") {
                self.setBundleLoader(true, JSON.parse(sectionParts[1]));
            } else
            if (codeParts[i] === "sourcemint-bundle-module") {
                self.setModule(null, sectionParts[3].match(/^.*\n([\s\S]+)\n.*$/)[1], JSON.parse(sectionParts[1]));
            } else
            if (codeParts[i] === "sourcemint-bundle-descriptor") {
                self.setDescriptor(null, sectionParts[3].match(/^.*\n([\s\S]+)\n.*$/)[1], JSON.parse(sectionParts[1]));
            } else
            if (codeParts[i] === "sourcemint-bundle-report") {
                self.setReport(JSON.parse(sectionParts[1]));
            } else {
                throw new Error("Found unknown section type '" + codeParts[i] + "'!");
            }
        }

        deferred.resolve();
    }
    catch(e)
    {
        deferred.reject(e);
    }

    return deferred.promise;
}
