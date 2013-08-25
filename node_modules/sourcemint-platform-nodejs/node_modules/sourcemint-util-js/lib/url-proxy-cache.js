
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs");
const URL = require("url");
const HTTP = require("http");
const HTTPS = require("https");
const Q = require("./q");
const WRENCH = require("wrench");
const UTIL = require("./util");


var UrlProxyCache = exports.UrlProxyCache = function(path, options) {
    this.path = path;
    this.options = UTIL.copy(options);
    ASSERT(typeof options.ttl !== "undefined", "'options.ttl' required!");
    if (typeof this.options.verbose === "undefined") {
        this.options.verbose = false;
    }
}

UrlProxyCache.prototype.get = function(url, options) {
    var self = this;

    options = options || {};
    
    var verbose = self.options.verbose;
    if (typeof options.verbose !== "undefined") {
        verbose = options.verbose;
    }

    var urlInfo = self.parseUrl(url);

    return ensureParentPathExists(urlInfo.cachePath).then(function() {
        
        function handleResponse(response) {
            
            if (response.status === 301 || response.status === 302) {
                // Redirect.
                return self.get(response.headers.location, options);
            } else {
                return response;
            }
        }

        var metaPath = urlInfo.cachePath + "~~meta";
        var pathExists = false;
        
        function getPathMtime(metaPath, path) {
            var deferred = Q.defer();
            PATH.exists(metaPath, function(exists) {
                if (!exists) {
                    deferred.resolve(false);
                    return;
                }
                PATH.exists(path, function(exists) {
                    pathExists = exists;
                    FS.stat(metaPath, function(err, stats) {
                        deferred.resolve(stats.mtime.getTime());
                    });
                });
            });
            return deferred.promise;
        }
        
        return getPathMtime(metaPath, urlInfo.cachePath).then(function(mtime) {

            var ttl = self.options.ttl;
            // If `options.ttl === false` then defer to instance ttl.
            // If `typeof options.ttl === "undefined"` then defer to instance ttl.
            if (typeof options.ttl !== "undefined" && options.ttl !== false && options.ttl >= -1) {
                ttl = options.ttl;
            }
            // If `ttl === -1` then force cache refresh.
            // If `ttl === 0` then cache indefinite.
            // If `ttl >= 1` then cache for ttl (milliseconds).     
            if (mtime && ttl != -1 && (ttl === 0 || ((mtime + ttl) > new Date().getTime()))) {

                function loadCached() {
                    var deferred = Q.defer();
                    function fail(err) {
                        if (!deferred) {
                            console.error(err.stack);
                            return;
                        }
                        deferred.reject(err);
                        deferred = null;
                    }
                    
                    FS.readFile(metaPath, function(err, meta) {
                        if (err) {
                            fail(err);
                            return;
                        }
                        try {
                            meta = JSON.parse(meta);
                        } catch(err) {
                            fail(err);
                            return;
                        }
                        if (meta.status === 301 || meta.status === 302 || meta.status === 404) {
                            if (verbose) console.log("cached " + meta.status + " " + urlInfo.href);
                            deferred.resolve(meta);
                            deferred = null;
                            return;
                        }
                        // If original request was 200 but path no longer exists.
                        if (!pathExists || meta.status === 304) {
                            if (meta.status === 304) {
                                console.log("TEMPORARY: Re-fetching as meta cache format has changed.");
                            }
                            var opts = UTIL.copy(options);
                            opts.ttl = -1;
                            Q.when(self.get(url, opts), deferred.resolve, deferred.reject);
                            return;
                        }
                        meta.status = 304;
                        if (options.loadBody === false) {
                            if (verbose) console.log("cached " + meta.status + " " + urlInfo.href);
                            deferred.resolve(meta);
                            deferred = null;
                            return;
                        }
                        FS.readFile(urlInfo.cachePath, function(err, data) {
                            if (err) {
                                fail(err);
                                return;
                            }
                            meta.body = data;
                            if (verbose) console.log("cached " + meta.status + " " + urlInfo.href);
                            deferred.resolve(meta);
                            deferred = null;
                        });
                    });
    
                    return deferred.promise;
                }
                
                return loadCached().then(function(response) {
                    return handleResponse(response);
                })
            }
            else {

                // TODO: If download already in progress attach to first download.

                var time = new Date().getTime();
                var tmpPath = urlInfo.cachePath + "~" + time;
                var metaTmpPath = metaPath + "~" + time;
                var meta = {};
                
                function writeMeta(callback) {
                    meta.cachePath = urlInfo.cachePath;
                    FS.writeFile(metaTmpPath, JSON.stringify(meta), function(err) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        FS.rename(metaTmpPath, metaPath, function(err) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            callback(null);
                        })
                    });
                }

                function makeRequest() {
                    var deferred = Q.defer();
                    function fail(err) {
                        if (!deferred) {
                            console.error(err.stack);
                            return;
                        }
                        deferred.reject(err);
                        deferred = null;
                    }

                    var done = Q.ref();
                    
                    var existingMeta = false;

                    // If we have meta data & file exists we send a HEAD request first to see if
                    // anything has changed.
                    done = Q.when(done, function() {
                        
                        if (ttl != -1) {
                            var wait = Q.defer();
    
                            PATH.exists(metaPath, function(exists) {
                                if (!exists) {
                                    wait.resolve();
                                    return;
                                }
                                
                                FS.readFile(metaPath, function(err, data) {
                                    if (err) {
                                        fail(err);
                                        return;
                                    }
                                    existingMeta = JSON.parse(data);
                              
                                    if (existingMeta.headers.etag) {
                                        // We have an Etag so we just send a 'If-None-Match' header below.
                                        wait.resolve();              
                                        return;
                                    }
                                    
                                    if (verbose) console.log("http HEAD " + urlInfo.href);
                                    var request = ((urlInfo.protocol==="https:")?HTTPS:HTTP).request({
                                        host: urlInfo.host,
                                        port: urlInfo.port || ((urlInfo.protocol==="https:")?443:80),
                                        path: urlInfo.path,
                                        method: "HEAD"
                                    }, function(res) {
                                        res.on("end", function() {
                                            if (verbose) console.log("head " + res.statusCode + " " + urlInfo.href);
                                            if (res.statusCode === 301 || res.statusCode === 302) {
                                                existingMeta.status = res.statusCode;
                                                wait.reject();
                                                deferred.resolve(existingMeta);
                                                deferred = null;
                                            } else
                                            if (res.statusCode === 200) {
                                                var same = true;
                                                if (typeof res.headers["content-length"] !== "undefined" && res.headers["content-length"] !== existingMeta.headers["content-length"]) {
                                                    same = false;
                                                }
                                                if (typeof res.headers["content-disposition"] !== "undefined" && res.headers["content-disposition"] !== existingMeta.headers["content-disposition"]) {
                                                    same = false;
                                                }
                                                // TODO: Check some other fields like 'Etag'?
                                                if (same) {
                                                    existingMeta.status = 304;

                                                    var time = new Date();
                                                    FS.utimesSync(metaPath, time, time);
                                                    if (verbose) console.log("touched " + metaPath);

                                                    if (options.loadBody === false) {
                                                        if (verbose) console.log("emit " + existingMeta.status + " " + urlInfo.href);
                                                        wait.reject();
                                                        deferred.resolve(existingMeta);
                                                        return;
                                                    }
                                                    FS.readFile(urlInfo.cachePath, function(err, data) {
                                                        if (err) {
                                                            fail(err);
                                                            return;
                                                        }
                                                        existingMeta.body = data;
                                                        if (verbose) console.log("emit " + existingMeta.status + " " + urlInfo.href);
                                                        wait.reject();
                                                        deferred.resolve(existingMeta);
                                                        deferred = null;
                                                    });
                                                } else {
                                                    wait.resolve();
                                                }
                                            } else {
                                                wait.resolve();
                                            }
                                        });
                                    });
                                    request.on("error", function(err) {
                                        // May not want to fail here but try again or make GET request?
                                        fail(err);
                                    });
                                    request.end();
                                });
                            });
                            return wait.promise;
                        }
                    });

                    Q.when(done, function() {

                        var writeStream = FS.createWriteStream(tmpPath);
                        writeStream.on("error", fail);
                        writeStream.on("close", function() {
                            if (deferred) {
                                // Success.
                                writeMeta(function(err) {
                                    if (err) {
                                        fail(err);
                                        return;
                                    }
                                    FS.rename(tmpPath, urlInfo.cachePath, function(err) {
                                        if (err) {
                                            fail(err);
                                            return;
                                        }
                                        if (options.loadBody === false) {
                                            deferred.resolve(meta);
                                            deferred = null;
                                            return;
                                        }
                                        FS.readFile(urlInfo.cachePath, function(err, data) {
                                            if (err) {
                                                fail(err);
                                                return;
                                            }
                                            meta.body = data;
                                            deferred.resolve(meta);
                                            deferred = null;
                                        });
                                    });
                                });
                            } else {
                                // We had an error.
                                FS.unlink(tmpPath, function(err) {
                                    if (err) console.error(err.stack);
                                });
                            }
                        });
                        
                        var headers = {};
                        if (existingMeta && existingMeta.headers.etag && ttl != -1) {
                            headers["If-None-Match"] = existingMeta.headers.etag;
                        }
                        if (verbose) console.log("http GET " + urlInfo.href);
                        var request = ((urlInfo.protocol==="https:")?HTTPS:HTTP).request({
                            host: urlInfo.host,
                            port: urlInfo.port || ((urlInfo.protocol==="https:")?443:80),
                            path: urlInfo.path,
                            method: "GET",
                            headers: headers
                        }, function(res) {
                            if (verbose) console.log("get " + res.statusCode + " " + urlInfo.href);
                            if (res.statusCode == 304) {
                                existingMeta.status = 304;
                                
                                var time = new Date();
                                FS.utimesSync(metaPath, time, time);
                                if (verbose) console.log("touched " + metaPath);

                                if (options.loadBody === false) {
                                    if (verbose) console.log("emit " + existingMeta.status + " " + urlInfo.href);
                                    deferred.resolve(existingMeta);
                                    deferred = null;
                                    writeStream.end();
                                    return;
                                }
                                FS.readFile(urlInfo.cachePath, function(err, data) {
                                    if (err) {
                                        fail(err);
                                        return;
                                    }
                                    existingMeta.body = data;
                                    if (verbose) console.log("emit " + existingMeta.status + " " + urlInfo.href);
                                    deferred.resolve(existingMeta);
                                    deferred = null;
                                    writeStream.end();
                                });
                                return;
                            }

                            meta.status = res.statusCode;
                            meta.headers = res.headers;
                            
                            if (res.statusCode !== 200) {
                                writeMeta(function(err) {
                                    if (err) {
                                        fail(err);
                                        return;
                                    }
                                    if (verbose) console.log("emit " + meta.status + " " + urlInfo.href);
                                    deferred.resolve(meta);
                                    deferred = null;
                                    writeStream.end();
                                });
                                return;
                            }
                            res.on("data", function(chunk) {
                                // TODO: Nicer download progress.
//                                process.stdout.write(".");
                                writeStream.write(chunk, "binary");
                            });
                            res.on("end", function() {
                                writeStream.end();
                            });
                        });
                        request.on("error", fail);
                        request.end();                        
                        
                    });
                    
                    return deferred.promise;
                }

                return makeRequest().then(function(response) {
                    return handleResponse(response);
                });
            }
        });
    });
}

UrlProxyCache.prototype.parseUrl = function(url) {
    var urlInfo = URL.parse(url);
    urlInfo.cachePath = PATH.join(this.path, urlInfo.protocol.replace(/:$/, ""), urlInfo.hostname, urlInfo.path);
    return urlInfo;
}


var lastRemovedPath = false;
function ensureParentPathExists(path) {
    var deferred = Q.defer();
    PATH.exists(PATH.dirname(path), function(exists) {
        if (exists) {
            deferred.resolve();
            return;
        }
        try {
            WRENCH.mkdirSyncRecursive(PATH.dirname(path));
            lastRemovedPath = false;
            deferred.resolve();
        } catch(err) {
            if (err.code === "ENOTDIR") {
                // We encountered a file along the path hierarchy that needs to be removed before we can create the rest of the dirs.
                // This may happen if a more general URL is requested and then a sub-path subsequently.
                // We assume that the most specific path is the valid one and remove the file in the parent path.
                // TODO: Find a better way to get the path to remove than taking it from the error message.
                var parentPath = path;
                while(true) {
                    if (!PATH.existsSync(parentPath)) {
                        if (parentPath === PATH.dirname(parentPath)) {
                            lastRemovedPath = false;
                            deferred.reject(err);
                            return;
                        }
                        parentPath = PATH.dirname(parentPath);
                    } else
                    if (!FS.statSync(parentPath).isDirectory()) {
                        lastRemovedPath = parentPath;
                        console.log("WARN: Removing file at '" + lastRemovedPath + "' as directory is expected!");                
                        FS.unlinkSync(lastRemovedPath);
                        break;
                    }
                }
                Q.when(ensureParentPathExists(path), deferred.resolve, deferred.reject);
                return;
            }
            lastRemovedPath = false;
            deferred.reject(err);
        }
    });
    return deferred.promise;
}


