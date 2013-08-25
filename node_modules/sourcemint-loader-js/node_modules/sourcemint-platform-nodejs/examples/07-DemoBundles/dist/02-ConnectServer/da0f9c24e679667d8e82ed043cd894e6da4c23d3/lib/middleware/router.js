// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/middleware/router.js","fileMtime":1332971498000,"id":"/lib/middleware/router.js"}
require.memoize("/lib/middleware/router.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/lib/middleware/router.js";
    var __dirname = require.sandbox.id + "/lib/middleware";
    
    /*!
     * Connect - router
     * Copyright(c) 2010 Sencha Inc.
     * Copyright(c) 2011 TJ Holowaychuk
     * MIT Licensed
     */
    
    /**
     * Module dependencies.
     */
    
    var utils = require('../utils')
      , parse = require('__nodejs__/url').parse;
    
    /**
     * Expose router.
     */
    
    exports = module.exports = router;
    
    /**
     * Supported HTTP / WebDAV methods.
     */
    
    var _methods = exports.methods = [
        'get'
      , 'post'
      , 'put'
      , 'delete'
      , 'connect'
      , 'options'
      , 'trace'
      , 'copy'
      , 'lock'
      , 'mkcol'
      , 'move'
      , 'propfind'
      , 'proppatch'
      , 'unlock'
      , 'report'
      , 'mkactivity'
      , 'checkout'
      , 'merge'
    ];
    
    /**
     * Provides Sinatra and Express-like routing capabilities.
     *
     * Examples:
     *
     *     connect.router(function(app){
     *       app.get('/user/:id', function(req, res, next){
     *         // populates req.params.id
     *       });
     *       app.put('/user/:id', function(req, res, next){
     *         // populates req.params.id
     *       });
     *     })
     *
     * @param {Function} fn
     * @return {Function}
     * @api public
     */
    
    function router(fn){
      var self = this
        , methods = {}
        , routes = {}
        , params = {};
    
      if (!fn) throw new Error('router provider requires a callback function');
    
      // Generate method functions
      _methods.forEach(function(method){
        methods[method] = generateMethodFunction(method.toUpperCase());
      });
    
      // Alias del -> delete
      methods.del = methods.delete;
    
      // Apply callback to all methods
      methods.all = function(){
        var args = arguments;
        _methods.forEach(function(name){
          methods[name].apply(this, args);
        });
        return self;
      };
    
      // Register param callback
      methods.param = function(name, fn){
        params[name] = fn;
      };
          
      fn.call(this, methods);
    
      function generateMethodFunction(name) {
        var localRoutes = routes[name] = routes[name] || [];
        return function(path, fn){
          var keys = []
            , middleware = [];
    
          // slice middleware
          if (arguments.length > 2) {
            middleware = Array.prototype.slice.call(arguments, 1, arguments.length);
            fn = middleware.pop();
            middleware = utils.flatten(middleware);
          }
    
          fn.middleware = middleware;
    
          if (!path) throw new Error(name + ' route requires a path');
          if (!fn) throw new Error(name + ' route ' + path + ' requires a callback');
          var regexp = path instanceof RegExp
            ? path
            : normalizePath(path, keys);
          localRoutes.push({
              fn: fn
            , path: regexp
            , keys: keys
            , orig: path
            , method: name
          });
          return self;
        };
      }
    
      function router(req, res, next){
        var route
          , self = this;
    
        (function pass(i){
          if (route = match(req, routes, i)) {
            var i = 0
              , keys = route.keys;
    
            req.params = route.params;
    
            // Param preconditions
            (function param(err) {
              try {
                var key = keys[i++]
                  , val = req.params[key]
                  , fn = params[key];
    
                if ('route' == err) {
                  pass(req._route_index + 1);
                // Error
                } else if (err) {
                  next(err);
                // Param has callback
                } else if (fn) {
                  // Return style
                  if (1 == fn.length) {
                    req.params[key] = fn(val);
                    param();
                  // Middleware style
                  } else {
                    fn(req, res, param, val);
                  }
                // Finished processing params
                } else if (!key) {
                  // route middleware
                  i = 0;
                  (function nextMiddleware(err){
                    var fn = route.middleware[i++];
                    if ('route' == err) {
                      pass(req._route_index + 1);
                    } else if (err) {
                      next(err);
                    } else if (fn) {
                      fn(req, res, nextMiddleware);
                    } else {
                      route.call(self, req, res, function(err){
                        if (err) {
                          next(err);
                        } else {
                          pass(req._route_index + 1);
                        }
                      });
                    }
                  })();
                // More params
                } else {
                  param();
                }
              } catch (err) {
                next(err);
              }
            })();
          } else if ('OPTIONS' == req.method) {
            options(req, res, routes);
          } else {
            next();
          }
        })();
      };
    
      router.remove = function(path, method){
        var fns = router.lookup(path, method);
        fns.forEach(function(fn){
          routes[fn.method].splice(fn.index, 1);
        });
      };
    
      router.lookup = function(path, method, ret){
        ret = ret || [];
    
        // method specific lookup
        if (method) {
          method = method.toUpperCase();
          if (routes[method]) {
            routes[method].forEach(function(route, i){
              if (path == route.orig) {
                var fn = route.fn;
                fn.regexp = route.path;
                fn.keys = route.keys;
                fn.path = route.orig;
                fn.method = route.method;
                fn.index = i;
                ret.push(fn);
              }
            });
          }
        // global lookup
        } else {
          _methods.forEach(function(method){
            router.lookup(path, method, ret);
          });
        }
    
        return ret;
      };
    
      router.match = function(url, method, ret){
        var ret = ret || []
          , i = 0
          , fn
          , req;
    
        // method specific matches
        if (method) {
          method = method.toUpperCase();
          req = { url: url, method: method };
          while (fn = match(req, routes, i)) {
            i = req._route_index + 1;
            ret.push(fn);
          } 
        // global matches
        } else {
          _methods.forEach(function(method){
            router.match(url, method, ret);
          });
        }
    
        return ret;
      };
    
      return router;
    }
    
    /**
     * Respond to OPTIONS.
     *
     * @param {ServerRequest} req
     * @param {ServerResponse} req
     * @param {Array} routes
     * @api private
     */
    
    function options(req, res, routes) {
      var pathname = parse(req.url).pathname
        , body = optionsFor(pathname, routes).join(',');
      res.writeHead(200, {
          'Content-Length': body.length
        , 'Allow': body
      });
      res.end(body);
    }
    
    /**
     * Return OPTIONS array for the given `path`, matching `routes`.
     *
     * @param {String} path
     * @param {Array} routes
     * @return {Array}
     * @api private
     */
    
    function optionsFor(path, routes) {
      return _methods.filter(function(method){
        var arr = routes[method.toUpperCase()];
        for (var i = 0, len = arr.length; i < len; ++i) {
          if (arr[i].path.test(path)) return true;
        }
      }).map(function(method){
        return method.toUpperCase();
      });
    }
    
    /**
     * Normalize the given path string,
     * returning a regular expression.
     *
     * An empty array should be passed,
     * which will contain the placeholder
     * key names. For example "/user/:id" will
     * then contain ["id"].
     *
     * @param  {String} path
     * @param  {Array} keys
     * @return {RegExp}
     * @api private
     */
    
    function normalizePath(path, keys) {
      path = path
        .concat('/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
          keys.push(key);
          slash = slash || '';
          return ''
            + (optional ? '' : slash)
            + '(?:'
            + (optional ? slash : '')
            + (format || '') + (capture || '([^/]+?)') + ')'
            + (optional || '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.+)');
      return new RegExp('^' + path + '$', 'i');
    }
    
    /**
     * Attempt to match the given request to
     * one of the routes. When successful
     * a route function is returned.
     *
     * @param  {ServerRequest} req
     * @param  {Object} routes
     * @return {Function}
     * @api private
     */
    
    function match(req, routes, i) {
      var captures
        , method = req.method
        , i = i || 0;
      if ('HEAD' == method) method = 'GET';
      if (routes = routes[method]) {
        var url = parse(req.url)
          , pathname = url.pathname;
        for (var len = routes.length; i < len; ++i) {
          var route = routes[i]
            , fn = route.fn
            , path = route.path
            , keys = fn.keys = route.keys;
          if (captures = path.exec(pathname)) {
            fn.method = method;
            fn.params = [];
            for (var j = 1, len = captures.length; j < len; ++j) {
              var key = keys[j-1],
                val = typeof captures[j] === 'string'
                  ? decodeURIComponent(captures[j])
                  : captures[j];
              if (key) {
                fn.params[key] = val;
              } else {
                fn.params.push(val);
              }
            }
            req._route_index = i;
            return fn;
          }
        }
      }
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"name":"connect","version":"1.8.6","description":"High performance middleware framework","keywords":["framework","web","middleware","connect","rack"],"repository":"git://github.com/senchalabs/connect","author":"TJ Holowaychuk <tj@vision-media.ca> (http://tjholowaychuk.com)","dependencies":{"qs":">= 0.4.0","mime":">= 0.0.1","formidable":"1.0.x"},"devDependencies":{"expresso":"0.9.2","koala":"0.1.2","less":"1.1.1","sass":"0.5.0","markdown":"0.2.1","ejs":"0.4.3","should":"0.3.2"},"main":"/lib/middleware/router.js","engines":{"node":">= 0.4.1 < 0.7.0"},"directories":{"lib":""},"mappings":{"__nodejs__":"__nodejs.org/0__"}}
);
// @sourcemint-bundle-descriptor: {"file":"nodejs.org/0/package.json","id":"043956adb8f7b26566da4cdc0e2ca286566dc494/package.json"}
require.memoize("043956adb8f7b26566da4cdc0e2ca286566dc494/package.json", 
{"main":"/lib/middleware/router.js","directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/middleware/router.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/middleware/router.js":{"staticLinks":{"../utils":"../utils","url":"__nodejs__/url"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js":{"staticLinks":{"crypto":"__nodejs__/crypto","path":"__nodejs__/path","fs":"__nodejs__/fs"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{"path":"nodejs.org/0/lib/middleware/router.js"},"modules":{},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/middleware/router.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/middleware/router.js":{"staticLinks":{"../utils":"../utils","url":"__nodejs__/url"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js":{"staticLinks":{"crypto":"__nodejs__/crypto","path":"__nodejs__/path","fs":"__nodejs__/fs"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{"path":"nodejs.org/0/lib/middleware/router.js"},"modules":{},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/07-DemoBundles/dist/02-ConnectServer/da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/middleware/router.js","packages":{"043956adb8f7b26566da4cdc0e2ca286566dc494":"nodejs.org/0"},"modules":{"/lib/middleware/router.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/middleware/router.js"}}}
