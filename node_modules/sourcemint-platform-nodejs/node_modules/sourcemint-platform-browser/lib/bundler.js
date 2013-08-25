/**
 * Copyright: 2012 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

var PATH = require("path");
var BUNDLER = require("sourcemint-bundler-js/lib/bundler");
var CONNECT = require("connect");
var Q = require("q");
var UTIL = require("n-util");
var WRENCH = require("wrench");


exports.bundle = function(packagePath, distributionPath, options)
{
	options = options || {};

	options.bundleLoaderAdapter = options.bundleLoaderAdapter || "github.com/sourcemint/platform-browser/0";

	return BUNDLER.bundle(packagePath, distributionPath, options);
}


exports.hoist = function(basePath, baseOptions)
{
    var basePathParts = basePath.match(/^(.*?)(\/\$(\d+))?$/);

    baseOptions = baseOptions || {};
	baseOptions.bundleLoaderAdapter = baseOptions.bundleLoaderAdapter || "github.com/sourcemint/platform-browser/0";

    return function(req, res, next)
    {
        var packagePath = basePath,
            options = UTIL.copy(baseOptions);

        // See if the base path has a parameter in it that we need to fill from the request parameters.
        // e.g. app.get(/^(?:\/([^\/]*?))(?:\.js)?(\/.*)?$/, BUNDLER.hoist(__dirname + "/$1", {
        if (typeof basePathParts[2] !== "undefined")
        {
            // TODO: Make this more generic.
            var paramIndex = parseInt(basePathParts[3]);
            if (req.params.length != (paramIndex + 1)) {
                throw new Error("Paramater index '" + paramIndex + "' used in packagePath '" + packagePath + "' not found in request.params '" + JSON.stringify(req.params) + "'!");
            }
            packagePath = packagePath.replace("$" + paramIndex, req.params[paramIndex - 1]);
        }

        if (typeof options.bundleUrlPrefix !== "undefined")
        {
            var bundleUrlPrefixParts = options.bundleUrlPrefix.match(/\$(\d+)/);
            if (bundleUrlPrefixParts && typeof bundleUrlPrefixParts[1] !== "undefined") {
                options.bundleUrlPrefix = options.bundleUrlPrefix.replace("$" + bundleUrlPrefixParts[1], req.params[parseInt(bundleUrlPrefixParts[1]) - 1]);
            }
        }

        if (PATH.exists(packagePath, function(exists)
        {
            if (exists)
            {
                req.url = req.params[req.params.length-1] || "";
                exports.Middleware(packagePath, options).handle(req, res);
            }
            else
            {
                console.error("Could not find package at '" + packagePath + "' requested by URL '" + req.originalUrl + "'!")

                if (typeof next === "function")
                {
                    next();
                }
                else
                {
                    // TODO: More generic error handler here?
                    res.writeHead(404);
                    res.end("File found!");
                }
            }
        }));
    };
}

var middlewareInstances = {};

var Middleware = exports.Middleware = function(packagePath, options)
{
    options = options || {};
    options.bundleLoader = options.bundleLoader || false;
    options.forceCompleteBuild = options.forceCompleteBuild || false;
    options.rebuildOnSourceChanges = options.rebuildOnSourceChanges || true;

    var distributionBasePath = options.distributionBasePath || (process.cwd() + "/.sourcemint/dist/" + packagePath.replace(/\//g, "+"));
    if (!PATH.existsSync(distributionBasePath)) {
        WRENCH.mkdirSyncRecursive(distributionBasePath, 0755);
    }

    // If we are called as a factory we create an instance if we don't already have one.
    if (!(this instanceof Middleware))
    {
        // Check if we already have an instance.
        var instanceKey = distributionBasePath + "/" + PATH.basename(packagePath);
        if (middlewareInstances[instanceKey])
        {
            if (middlewareInstances[instanceKey][0] !== packagePath) {
                throw new Error("Cannot store a different package '" + packagePath + "' in the same distribution path '" + instanceKey + "' as already used by package '" + middlewareInstances[instanceKey][0] + "'!");
            }
            if (middlewareInstances[instanceKey][1] !== JSON.stringify(options)) {
                throw new Error("Cannot store the same package '" + packagePath + "' in the same distribution path '" + instanceKey + "' using different options!");
            }
            return middlewareInstances[instanceKey][2];
        }
        middlewareInstances[instanceKey] = [
            packagePath,
            JSON.stringify(options),
            new Middleware(packagePath, options)
        ];
        return middlewareInstances[instanceKey][2];
    }

    this.bundler = BUNDLER.Bundler(packagePath, distributionBasePath + "/" + PATH.basename(packagePath), options);
}

Middleware.prototype.handle = function(request, response)
{
    var self = this;

    // Only generate bundle(s) if a root bundle is requested.
    if (request.url === "")
    {
        Q.when(self.bundler.generateBundles(true), function()
        {
            serve();
        }).fail(function(err)
        {
            response.writeHead(500);
            console.error(err.stack);
            // TODO: Only expose error if configured to do so.
            response.end("Error: " + err);
        });
    }
    else
    {
        // A resource within the bundle is requested. We assume that if this request has come in
        // that the bundle has been generated on a previous request so we can just serve the file.
        serve();
    }

    function serve()
    {
        request.url = "/" + PATH.basename(self.bundler.distributionPath) + (request.url || ".js");

        (CONNECT.static(PATH.dirname(self.bundler.distributionPath)))(request, response, function()
        {
            response.writeHead(404);
            response.end("Not found!");
        });
    }
}
