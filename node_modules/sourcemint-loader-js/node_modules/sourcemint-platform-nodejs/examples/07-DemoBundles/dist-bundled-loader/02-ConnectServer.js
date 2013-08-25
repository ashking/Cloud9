// @sourcemint-bundle-loader: {"platformLoaderSource":{}}
var require, sourcemint;
(function() {
    var rootBundleLoader = function(uri, loadedCallback) {
// @sourcemint-bundle-ignore: 
require.bundle("", function(require)
{
// @sourcemint-bundle-header: {}

// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js","fileMtime":1329280339000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    var CONNECT = require("connect/index.js");
    
    
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
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js","fileMtime":1332971498000,"id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/index.js"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/index.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "da0f9c24e679667d8e82ed043cd894e6da4c23d3/index.js";
    var __dirname = require.sandbox.id + "/da0f9c24e679667d8e82ed043cd894e6da4c23d3";
    
    module.exports = require('./lib/connect');
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js","fileMtime":1332971498000,"id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/connect.js"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/connect.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/connect.js";
    var __dirname = require.sandbox.id + "/da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib";
    
    /*!
     * Connect
     * Copyright(c) 2010 Sencha Inc.
     * Copyright(c) 2011 TJ Holowaychuk
     * MIT Licensed
     */
    
    /**
     * Module dependencies.
     */
    
    var HTTPServer = require('./http').Server
      , HTTPSServer = require('./https').Server
      , fs = require('__nodejs__/fs');
    
    // node patches
    
    require('./patch');
    
    // expose createServer() as the module
    
    exports = module.exports = createServer;
    
    /**
     * Framework version.
     */
    
    exports.version = '1.8.6';
    
    /**
     * Initialize a new `connect.HTTPServer` with the middleware
     * passed to this function. When an object is passed _first_,
     * we assume these are the tls options, and return a `connect.HTTPSServer`.
     *
     * Examples:
     *
     * An example HTTP server, accepting several middleware.
     *
     *     var server = connect.createServer(
     *         connect.logger()
     *       , connect.static(__dirname + '/public')
     *     );
     *
     * An HTTPS server, utilizing the same middleware as above.
     *
     *     var server = connect.createServer(
     *         { key: key, cert: cert }
     *       , connect.logger()
     *       , connect.static(__dirname + '/public')
     *     );
     *
     * Alternatively with connect 1.0 we may omit `createServer()`.
     *
     *     connect(
     *         connect.logger()
     *       , connect.static(__dirname + '/public')
     *     ).listen(3000);
     *
     * @param  {Object|Function} ...
     * @return {Server}
     * @api public
     */
    
    function createServer() {
      if ('object' == typeof arguments[0]) {
        return new HTTPSServer(arguments[0], Array.prototype.slice.call(arguments, 1));
      } else {
        return new HTTPServer(Array.prototype.slice.call(arguments));
      }
    };
    
    // support connect.createServer()
    
    exports.createServer = createServer;
    
    // auto-load getters
    
    exports.middleware = {};
    
    /**
     * Auto-load bundled middleware with getters.
     */
    
    fs.readdirSync(__dirname + '/middleware').forEach(function(filename){
      if (/\.js$/.test(filename)) {
        var name = filename.substr(0, filename.lastIndexOf('.'));
        exports.middleware.__defineGetter__(name, function(){
          return require('./middleware/' + name);
        });
      }
    });
    
    // expose utils
    
    exports.utils = require('./utils');
    
    // expose getters as first-class exports
    
    exports.utils.merge(exports, exports.middleware);
    
    // expose constructors
    
    exports.HTTPServer = HTTPServer;
    exports.HTTPSServer = HTTPSServer;
    
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js","fileMtime":1332971498000,"id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/http.js"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/http.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/http.js";
    var __dirname = require.sandbox.id + "/da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib";
    
    /*!
     * Connect - HTTPServer
     * Copyright(c) 2010 Sencha Inc.
     * Copyright(c) 2011 TJ Holowaychuk
     * MIT Licensed
     */
    
    /**
     * Module dependencies.
     */
    
    var http = require('__nodejs__/http')
      , parse = require('__nodejs__/url').parse
      , assert = require('__nodejs__/assert');
    
    // environment
    
    var env = process.env.NODE_ENV || 'development';
    
    /**
     * Initialize a new `Server` with the given `middleware`.
     *
     * Examples:
     *
     *     var server = connect.createServer(
     *         connect.favicon()
     *       , connect.logger()
     *       , connect.static(__dirname + '/public')
     *     );
     *
     * @params {Array} middleware 
     * @return {Server}
     * @api public
     */
    
    var Server = exports.Server = function HTTPServer(middleware) {
      this.stack = [];
      middleware.forEach(function(fn){
        this.use(fn);
      }, this);
      http.Server.call(this, this.handle);
    };
    
    /**
     * Inherit from `http.Server.prototype`.
     */
    
    Server.prototype.__proto__ = http.Server.prototype;
    
    /**
     * Utilize the given middleware `handle` to the given `route`,
     * defaulting to _/_. This "route" is the mount-point for the
     * middleware, when given a value other than _/_ the middleware
     * is only effective when that segment is present in the request's
     * pathname.
     *
     * For example if we were to mount a function at _/admin_, it would
     * be invoked on _/admin_, and _/admin/settings_, however it would
     * not be invoked for _/_, or _/posts_.
     *
     * This is effectively the same as passing middleware to `connect.createServer()`,
     * however provides a progressive api.
     *
     * Examples:
     *
     *      var server = connect.createServer();
     *      server.use(connect.favicon());
     *      server.use(connect.logger());
     *      server.use(connect.static(__dirname + '/public'));
     *
     * If we wanted to prefix static files with _/public_, we could
     * "mount" the `static()` middleware:
     *
     *      server.use('/public', connect.static(__dirname + '/public'));
     *
     * This api is chainable, meaning the following is valid:
     *
     *      connect.createServer()
     *        .use(connect.favicon())
     *        .use(connect.logger())
     *        .use(connect.static(__dirname + '/public'))
     *        .listen(3000);
     *
     * @param {String|Function} route or handle
     * @param {Function} handle
     * @return {Server}
     * @api public
     */
    
    Server.prototype.use = function(route, handle){
      this.route = '/';
    
      // default route to '/'
      if ('string' != typeof route) {
        handle = route;
        route = '/';
      }
    
      // wrap sub-apps
      if ('function' == typeof handle.handle) {
        var server = handle;
        server.route = route;
        handle = function(req, res, next) {
          server.handle(req, res, next);
        };
      }
    
      // wrap vanilla http.Servers
      if (handle instanceof http.Server) {
        handle = handle.listeners('request')[0];
      }
    
      // normalize route to not trail with slash
      if ('/' == route[route.length - 1]) {
        route = route.substr(0, route.length - 1);
      }
    
      // add the middleware
      this.stack.push({ route: route, handle: handle });
    
      // allow chaining
      return this;
    };
    
    /**
     * Handle server requests, punting them down
     * the middleware stack.
     *
     * @api private
     */
    
    Server.prototype.handle = function(req, res, out) {
      var writeHead = res.writeHead
        , stack = this.stack
        , removed = ''
        , index = 0;
    
      function next(err) {
        var layer, path, c;
        req.url = removed + req.url;
        req.originalUrl = req.originalUrl || req.url;
        removed = '';
    
        layer = stack[index++];
    
        // all done
        if (!layer || res.headerSent) {
          // but wait! we have a parent
          if (out) return out(err);
    
          // error
          if (err) {
            var msg = 'production' == env
              ? 'Internal Server Error'
              : err.stack || err.toString();
    
            // output to stderr in a non-test env
            if ('test' != env) console.error(err.stack || err.toString());
    
            // unable to respond
            if (res.headerSent) return req.socket.destroy();
    
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            if ('HEAD' == req.method) return res.end();
            res.end(msg);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            if ('HEAD' == req.method) return res.end();
            res.end('Cannot ' + req.method + ' ' + req.url);
          }
          return;
        }
    
        try {
          path = parse(req.url).pathname;
          if (undefined == path) path = '/';
    
          // skip this layer if the route doesn't match.
          if (0 != path.indexOf(layer.route)) return next(err);
    
          c = path[layer.route.length];
          if (c && '/' != c && '.' != c) return next(err);
    
          // Call the layer handler
          // Trim off the part of the url that matches the route
          removed = layer.route;
          req.url = req.url.substr(removed.length);
    
          // Ensure leading slash
          if ('/' != req.url[0]) req.url = '/' + req.url;
    
          var arity = layer.handle.length;
          if (err) {
            if (arity === 4) {
              layer.handle(err, req, res, next);
            } else {
              next(err);
            }
          } else if (arity < 4) {
            layer.handle(req, res, next);
          } else {
            next();
          }
        } catch (e) {
          if (e instanceof assert.AssertionError) {
            console.error(e.stack + '\n');
            next(e);
          } else {
            next(e);
          }
        }
      }
      next();
    };
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js","fileMtime":1332971498000,"id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/https.js"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/https.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/https.js";
    var __dirname = require.sandbox.id + "/da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib";
    
    /*!
     * Connect - HTTPServer
     * Copyright(c) 2010 Sencha Inc.
     * Copyright(c) 2011 TJ Holowaychuk
     * MIT Licensed
     */
    
    /**
     * Module dependencies.
     */
    
    var HTTPServer = require('./http').Server
      , https = require('__nodejs__/https');
    
    /**
     * Initialize a new `Server` with the given
     *`options` and `middleware`. The HTTPS api
     * is identical to the [HTTP](http.html) server,
     * however TLS `options` must be provided before
     * passing in the optional middleware.
     *
     * @params {Object} options
     * @params {Array} middleawre
     * @return {Server}
     * @api public
     */
    
    var Server = exports.Server = function HTTPSServer(options, middleware) {
      this.stack = [];
      middleware.forEach(function(fn){
        this.use(fn);
      }, this);
      https.Server.call(this, options, this.handle);
    };
    
    /**
     * Inherit from `http.Server.prototype`.
     */
    
    Server.prototype.__proto__ = https.Server.prototype;
    
    // mixin HTTPServer methods
    
    Object.keys(HTTPServer.prototype).forEach(function(method){
      Server.prototype[method] = HTTPServer.prototype[method];
    });
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js","fileMtime":1332971498000,"id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/patch.js"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/patch.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/patch.js";
    var __dirname = require.sandbox.id + "/da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib";
    
    /*!
     * Connect
     * Copyright(c) 2011 TJ Holowaychuk
     * MIT Licensed
     */
    
    /**
     * Module dependencies.
     */
    
    var http = require('__nodejs__/http')
      , res = http.OutgoingMessage.prototype;
    
    // original setHeader()
    
    var setHeader = res.setHeader;
    
    // original _renderHeaders()
    
    var _renderHeaders = res._renderHeaders;
    
    if (res._hasConnectPatch) return;
    
    /**
     * Provide a public "header sent" flag
     * until node does.
     *
     * @return {Boolean}
     * @api public
     */
    
    res.__defineGetter__('headerSent', function(){
      return this._headerSent;
    });
    
    /**
     * Set header `field` to `val`, special-casing
     * the `Set-Cookie` field for multiple support.
     *
     * @param {String} field
     * @param {String} val
     * @api public
     */
    
    res.setHeader = function(field, val){
      var key = field.toLowerCase()
        , prev;
    
      // special-case Set-Cookie
      if (this._headers && 'set-cookie' == key) {
        if (prev = this.getHeader(field)) {
          val = Array.isArray(prev)
            ? prev.concat(val)
            : [prev, val];
        }
      // charset
      } else if ('content-type' == key && this.charset) {
        val += '; charset=' + this.charset;
      }
    
      return setHeader.call(this, field, val);
    };
    
    /**
     * Proxy `res.end()` to expose a 'header' event,
     * allowing arbitrary augmentation before the header
     * fields are written to the socket.
     *
     * NOTE: this _only_ supports node's progressive header
     * field API aka `res.setHeader()`.
     */
    
    res._renderHeaders = function(){
      this.emit('header');
      return _renderHeaders.call(this);
    };
    
    res._hasConnectPatch = true;
    
}
);
// @sourcemint-bundle-module: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js","fileMtime":1332971498000,"id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/utils.js"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/utils.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/utils.js";
    var __dirname = require.sandbox.id + "/da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib";
    
    /*!
     * Connect - utils
     * Copyright(c) 2010 Sencha Inc.
     * Copyright(c) 2011 TJ Holowaychuk
     * MIT Licensed
     */
    
    /**
     * Module dependencies.
     */
    
    var crypto = require('__nodejs__/crypto')
      , Path = require('__nodejs__/path')
      , fs = require('__nodejs__/fs');
    
    /**
     * Flatten the given `arr`.
     *
     * @param {Array} arr
     * @return {Array}
     * @api private
     */
    
    exports.flatten = function(arr, ret){
      var ret = ret || []
        , len = arr.length;
      for (var i = 0; i < len; ++i) {
        if (Array.isArray(arr[i])) {
          exports.flatten(arr[i], ret);
        } else {
          ret.push(arr[i]);
        }
      }
      return ret;
    };
    
    /**
     * Return md5 hash of the given string and optional encoding,
     * defaulting to hex.
     *
     *     utils.md5('wahoo');
     *     // => "e493298061761236c96b02ea6aa8a2ad"
     *
     * @param {String} str
     * @param {String} encoding
     * @return {String}
     * @api public
     */
    
    exports.md5 = function(str, encoding){
      return crypto
        .createHash('md5')
        .update(str)
        .digest(encoding || 'hex');
    };
    
    /**
     * Merge object b with object a.
     *
     *     var a = { foo: 'bar' }
     *       , b = { bar: 'baz' };
     *     
     *     utils.merge(a, b);
     *     // => { foo: 'bar', bar: 'baz' }
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object}
     * @api public
     */
    
    exports.merge = function(a, b){
      if (a && b) {
        for (var key in b) {
          a[key] = b[key];
        }
      }
      return a;
    };
    
    /**
     * Escape the given string of `html`.
     *
     * @param {String} html
     * @return {String}
     * @api public
     */
    
    exports.escape = function(html){
      return String(html)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
    
    
    /**
     * Return a unique identifier with the given `len`.
     *
     *     utils.uid(10);
     *     // => "FDaS435D2z"
     *
     * @param {Number} len
     * @return {String}
     * @api public
     */
    
    exports.uid = function(len) {
      var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;
    
      for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
      }
    
      return buf.join('');
    };
    
    /**
     * Parse the given cookie string into an object.
     *
     * @param {String} str
     * @return {Object}
     * @api public
     */
    
    exports.parseCookie = function(str){
      var obj = {}
        , pairs = str.split(/[;,] */);
      for (var i = 0, len = pairs.length; i < len; ++i) {
        var pair = pairs[i]
          , eqlIndex = pair.indexOf('=')
          , key = pair.substr(0, eqlIndex).trim().toLowerCase()
          , val = pair.substr(++eqlIndex, pair.length).trim();
    
        // quoted values
        if ('"' == val[0]) val = val.slice(1, -1);
    
        // only assign once
        if (undefined == obj[key]) {
          val = val.replace(/\+/g, ' ');
          try {
            obj[key] = decodeURIComponent(val);
          } catch (err) {
            if (err instanceof URIError) {
              obj[key] = val;
            } else {
              throw err;
            }
          }
        }
      }
      return obj;
    };
    
    /**
     * Serialize the given object into a cookie string.
     *
     *      utils.serializeCookie('name', 'tj', { httpOnly: true })
     *      // => "name=tj; httpOnly"
     *
     * @param {String} name
     * @param {String} val
     * @param {Object} obj
     * @return {String}
     * @api public
     */
    
    exports.serializeCookie = function(name, val, obj){
      var pairs = [name + '=' + encodeURIComponent(val)]
        , obj = obj || {};
    
      if (obj.domain) pairs.push('domain=' + obj.domain);
      if (obj.path) pairs.push('path=' + obj.path);
      if (obj.expires) pairs.push('expires=' + obj.expires.toUTCString());
      if (obj.httpOnly) pairs.push('httpOnly');
      if (obj.secure) pairs.push('secure');
    
      return pairs.join('; ');
    };
    
    /**
     * Pause `data` and `end` events on the given `obj`.
     * Middleware performing async tasks _should_ utilize
     * this utility (or similar), to re-emit data once
     * the async operation has completed, otherwise these
     * events may be lost.
     *
     *      var pause = utils.pause(req);
     *      fs.readFile(path, function(){
     *         next();
     *         pause.resume();
     *      });
     *
     * @param {Object} obj
     * @return {Object}
     * @api public
     */
    
    exports.pause = function(obj){
      var onData
        , onEnd
        , events = [];
    
      // buffer data
      obj.on('data', onData = function(data, encoding){
        events.push(['data', data, encoding]);
      });
    
      // buffer end
      obj.on('end', onEnd = function(data, encoding){
        events.push(['end', data, encoding]);
      });
    
      return {
        end: function(){
          obj.removeListener('data', onData);
          obj.removeListener('end', onEnd);
        },
        resume: function(){
          this.end();
          for (var i = 0, len = events.length; i < len; ++i) {
            obj.emit.apply(obj, events[i]);
          }
        }
      };
    };
    
    /**
     * Check `req` and `res` to see if it has been modified.
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @return {Boolean}
     * @api public
     */
    
    exports.modified = function(req, res, headers) {
      var headers = headers || res._headers || {}
        , modifiedSince = req.headers['if-modified-since']
        , lastModified = headers['last-modified']
        , noneMatch = req.headers['if-none-match']
        , etag = headers['etag'];
    
      if (noneMatch) noneMatch = noneMatch.split(/ *, */);
    
      // check If-None-Match
      if (noneMatch && etag && ~noneMatch.indexOf(etag)) {
        return false;
      }
    
      // check If-Modified-Since
      if (modifiedSince && lastModified) {
        modifiedSince = new Date(modifiedSince);
        lastModified = new Date(lastModified);
        // Ignore invalid dates
        if (!isNaN(modifiedSince.getTime())) {
          if (lastModified <= modifiedSince) return false;
        }
      }
      
      return true;
    };
    
    /**
     * Strip `Content-*` headers from `res`.
     *
     * @param {ServerResponse} res
     * @api public
     */
    
    exports.removeContentHeaders = function(res){
      Object.keys(res._headers).forEach(function(field){
        if (0 == field.indexOf('content')) {
          res.removeHeader(field);
        }
      });
    };
    
    /**
     * Check if `req` is a conditional GET request.
     *
     * @param {IncomingMessage} req
     * @return {Boolean}
     * @api public
     */
    
    exports.conditionalGET = function(req) {
      return req.headers['if-modified-since']
        || req.headers['if-none-match'];
    };
    
    /**
     * Respond with 403 "Forbidden".
     *
     * @param {ServerResponse} res
     * @api public
     */
    
    exports.forbidden = function(res) {
      var body = 'Forbidden';
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', body.length);
      res.statusCode = 403;
      res.end(body);
    };
    
    /**
     * Respond with 401 "Unauthorized".
     *
     * @param {ServerResponse} res
     * @param {String} realm
     * @api public
     */
    
    exports.unauthorized = function(res, realm) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
      res.end('Unauthorized');
    };
    
    /**
     * Respond with 400 "Bad Request".
     *
     * @param {ServerResponse} res
     * @api public
     */
    
    exports.badRequest = function(res) {
      res.statusCode = 400;
      res.end('Bad Request');
    };
    
    /**
     * Respond with 304 "Not Modified".
     *
     * @param {ServerResponse} res
     * @param {Object} headers
     * @api public
     */
    
    exports.notModified = function(res) {
      exports.removeContentHeaders(res);
      res.statusCode = 304;
      res.end();
    };
    
    /**
     * Return an ETag in the form of `"<size>-<mtime>"`
     * from the given `stat`.
     *
     * @param {Object} stat
     * @return {String}
     * @api public
     */
    
    exports.etag = function(stat) {
      return '"' + stat.size + '-' + Number(stat.mtime) + '"';
    };
    
    /**
     * Parse "Range" header `str` relative to the given file `size`.
     *
     * @param {Number} size
     * @param {String} str
     * @return {Array}
     * @api public
     */
    
    exports.parseRange = function(size, str){
      var valid = true;
      var arr = str.substr(6).split(',').map(function(range){
        var range = range.split('-')
          , start = parseInt(range[0], 10)
          , end = parseInt(range[1], 10);
    
        // -500
        if (isNaN(start)) {
          start = size - end;
          end = size - 1;
        // 500-
        } else if (isNaN(end)) {
          end = size - 1;
        }
    
        // Invalid
        if (isNaN(start) || isNaN(end) || start > end) valid = false;
    
        return { start: start, end: end };
      });
      return valid ? arr : undefined;
    };
    
    /**
     * Parse the given Cache-Control `str`.
     *
     * @param {String} str
     * @return {Object}
     * @api public
     */
    
    exports.parseCacheControl = function(str){
      var directives = str.split(',')
        , obj = {};
    
      for(var i = 0, len = directives.length; i < len; i++) {
        var parts = directives[i].split('=')
          , key = parts.shift().trim()
          , val = parseInt(parts.shift(), 10);
    
        obj[key] = isNaN(val) ? true : val;
      }
    
      return obj;
    };
    
    
    /**
     * Convert array-like object to an `Array`.
     *
     * node-bench measured "16.5 times faster than Array.prototype.slice.call()"
     *
     * @param {Object} obj
     * @return {Array}
     * @api public
     */
    
    var toArray = exports.toArray = function(obj){
      var len = obj.length
        , arr = new Array(len);
      for (var i = 0; i < len; ++i) {
        arr[i] = obj[i];
      }
      return arr;
    };
    
    /**
     * Retrun a random int, used by `utils.uid()`
     *
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
     * @api private
     */
    
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"private":true,"name":"sourcemint-platform-nodejs-examples-06-Demos-02-ConnectServer","version":"0.1.0","engines":{"nodejs":"0.x"},"dependencies":{"connect":"1.x"},"scripts":{"test":"node test"},"main":"/main.js","directories":{"lib":""},"mappings":{"connect":"da0f9c24e679667d8e82ed043cd894e6da4c23d3"}}
);
// @sourcemint-bundle-descriptor: {"file":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/package.json","id":"da0f9c24e679667d8e82ed043cd894e6da4c23d3/package.json"}
require.memoize("da0f9c24e679667d8e82ed043cd894e6da4c23d3/package.json", 
{"name":"connect","version":"1.8.6","description":"High performance middleware framework","keywords":["framework","web","middleware","connect","rack"],"repository":"git://github.com/senchalabs/connect","author":"TJ Holowaychuk <tj@vision-media.ca> (http://tjholowaychuk.com)","dependencies":{"qs":">= 0.4.0","mime":">= 0.0.1","formidable":"1.0.x"},"devDependencies":{"expresso":"0.9.2","koala":"0.1.2","less":"1.1.1","sass":"0.5.0","markdown":"0.2.1","ejs":"0.4.3","should":"0.3.2"},"main":"index","engines":{"node":">= 0.4.1 < 0.7.0"},"directories":{"lib":""},"mappings":{"__nodejs__":"__nodejs.org/0__"}}
);
// @sourcemint-bundle-descriptor: {"file":"nodejs.org/0/package.json","id":"043956adb8f7b26566da4cdc0e2ca286566dc494/package.json"}
require.memoize("043956adb8f7b26566da4cdc0e2ca286566dc494/package.json", 
{"directories":{"lib":""},"mappings":{}}
);
// @sourcemint-bundle-ignore: 
});
// @sourcemint-bundle-ignore: 
        if (typeof loadedCallback === "function") loadedCallback();
    }
    function initLoader(exports) {
/**
 * Copyright: 2011 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

// NOTE: Remove lines marked /*DEBUG*/ when compiling loader for 'min' release!

// Ignore all globals except for `require`, `exports` and `sourcemint`.
// Declare `require` global but ignore if it already exists.
var require;
// Set `sourcemint` global no matter what.
var sourcemint = null;
// Combat pollution if used via <script> tag.
(function (global, document) {

	var loadedBundles = [],
		// @see https://github.com/unscriptable/curl/blob/62caf808a8fd358ec782693399670be6806f1845/src/curl.js#L69
		readyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 };


	// A set of modules working together.
	var Sandbox = function(sandboxIdentifier, loadedCallback, sandboxOptions) {

		var moduleInitializers = {},
			initializedModules = {},
			/*DEBUG*/ bundleIdentifiers = {},
			packages = {},
			headTag,
			loadingBundles = {};

		var sandbox = {
				id: sandboxIdentifier
			};


		// @credit https://github.com/unscriptable/curl/blob/62caf808a8fd358ec782693399670be6806f1845/src/curl.js#L319-360
		function loadInBrowser(uri, loadedCallback) {
		    // See if we are in a web worker.
		    if (typeof importScripts !== "undefined") {
		        importScripts(uri.replace(/^\/?\{host\}/, ""));
		        loadedCallback();
		        return;
		    }
            if (/^\/?\{host\}\//.test(uri)) {
                uri = document.location.protocol + "//" + document.location.host + uri.replace(/^\/?\{host\}/, "");
            } else
            if (/^\//.test(uri)) {
                uri = document.location.protocol + "/" + uri;
            }
			if (!headTag) {
				headTag = document.getElementsByTagName("head")[0];
			}
			var element = document.createElement("script");
			element.type = "text/javascript";
			element.onload = element.onreadystatechange = function(ev) {
				ev = ev || global.event;
				if (ev.type === "load" || readyStates[this.readyState]) {
					this.onload = this.onreadystatechange = this.onerror = null;
					loadedCallback(function() {
						element.parentNode.removeChild(element);
					});
				}
			}
			element.onerror = function(e) {
				/*DEBUG*/ throw new Error("Syntax error or http error: " + uri);
			}
			element.charset = "utf-8";
			element.async = true;
			element.src = uri;
			element = headTag.insertBefore(element, headTag.firstChild);
		}

		function load(bundleIdentifier, packageIdentifier, loadedCallback) {
            if (packageIdentifier !== "") {
                bundleIdentifier = ("/" + packageIdentifier + "/" + bundleIdentifier).replace(/\/+/g, "/");
            }
			if (initializedModules[bundleIdentifier]) {
				// Module is already loaded and initialized.
				loadedCallback(sandbox);
			} else {
				// Module is not initialized.
				if (loadingBundles[bundleIdentifier]) {
					// Module is already loading.
					loadingBundles[bundleIdentifier].push(loadedCallback);
				} else {
					// Module is not already loading.
					loadingBundles[bundleIdentifier] = [];
					bundleIdentifier = sandboxIdentifier + bundleIdentifier;
					// Default to our script-injection browser loader.
					(sandboxOptions.rootBundleLoader || sandboxOptions.load || loadInBrowser)(bundleIdentifier, function(cleanupCallback) {
					    // The rootBundleLoader is only applicable for the first load.
                        delete sandboxOptions.rootBundleLoader;
						finalizeLoad(bundleIdentifier, packageIdentifier);
						loadedCallback(sandbox);
						if (cleanupCallback) {
							cleanupCallback();
						}
					});
				}
			}
		}

		// Called after a bundle has been loaded. Takes the top bundle off the *loading* stack
		// and makes the new modules available to the sandbox.
		// If a `packageIdentifier` is supplied we prefix it to all module identifiers anchored
		// at the root of the bundle (starting with `/`).
		function finalizeLoad(bundleIdentifier, packageIdentifier)
		{
			// Assume a consistent statically linked set of modules has been memoized.
			/*DEBUG*/ bundleIdentifiers[bundleIdentifier] = loadedBundles[0][0];
			var key;
			for (key in loadedBundles[0][1]) {
				// Only add modules that don't already exist!
				// TODO: Log warning in debug mode if module already exists.
				if (typeof moduleInitializers[key] === "undefined") {
					moduleInitializers[packageIdentifier + key] = loadedBundles[0][1][key];
				}
			}
			loadedBundles.shift();
		}

		var Package = function(packageIdentifier) {
			if (packages[packageIdentifier]) {
				return packages[packageIdentifier];
			}
			
			var descriptor = moduleInitializers[packageIdentifier + "/package.json"] || {
					main: "/main.js"
				},
				mappings = descriptor.mappings || {},
				directories = descriptor.directories || {},
				libPath = (typeof directories.lib !== "undefined" && directories.lib != "")?directories.lib + "/":"";
			
			var pkg = {
				id: packageIdentifier,
				main: descriptor.main
			};

			var Module = function(moduleIdentifier) {

				var moduleIdentifierSegment = moduleIdentifier.replace(/\/[^\/]*$/, "").split("/"),
					module = {
						id: moduleIdentifier,
						exports: {}
					};

				function normalizeIdentifier(identifier) {
				    // If we have a period (".") in the basename we want an absolute path from
				    // the root of the package. Otherwise a relative path to the "lib" directory.
				    if (identifier.split("/").pop().indexOf(".") === -1) {
				        // We have a module relative to the "lib" directory of the package.
				        identifier = identifier + ".js";
				    } else
				    if (!/^\//.test(identifier)) {
				        // We want an absolute path for the module from the root of the package.
				        identifier = "/" + identifier;
				    }
                    return identifier;
				}
				
				function resolveIdentifier(identifier) {
					// Check for relative module path to module within same package.
					if (/^\./.test(identifier)) {
						var segments = identifier.replace(/^\.\//, "").split("../");
						identifier = "/" + moduleIdentifierSegment.slice(1, moduleIdentifierSegment.length-segments.length+1).concat(segments[segments.length-1]).join("/");
						return [pkg, normalizeIdentifier(identifier)];
					} else
					// Check for mapped module path to module within mapped package.
					{
						identifier = identifier.split("/");
						/*DEBUG*/ if (typeof mappings === "undefined") {
						/*DEBUG*/ 	throw new Error("Descriptor for sandbox '" + sandbox.id + "' does not declare 'mappings' property needed to resolve module path '" + identifier.join("/") + "' in module '" + moduleIdentifier + "'!");
						/*DEBUG*/ }
						/*DEBUG*/ if (typeof mappings[identifier[0]] === "undefined") {
						/*DEBUG*/ 	throw new Error("Descriptor for sandbox '" + sandbox.id + "' does not declare 'mappings[\"" + identifier[0] + "\"]' property needed to resolve module path '" + identifier.join("/") + "' in module '" + moduleIdentifier + "'!");
						/*DEBUG*/ }
						return [Package(mappings[identifier[0]]), normalizeIdentifier(identifier.slice(1).join("/"))];
					}
				}
				
				// Statically link a module and its dependencies
				module.require = function(identifier) {
				    // HACK: RequireJS compatibility.
				    // TODO: Move this to a plugin.
				    if (typeof identifier !== "string") {
				        /*DEBUG*/ if (identifier.length > 1) {
			            /*DEBUG*/     throw new Error("Dynamic 'require([])' may only specify one module in module '" + moduleIdentifier + "'!");
				        /*DEBUG*/ }
				        return module.require.async.call(null, identifier[0], arguments[1]);
				    }
					identifier = resolveIdentifier(identifier);
					return identifier[0].require(identifier[1]).exports;
				};

				module.require.supports = [
		            "ucjs2-pinf-0"
		        ];

				module.require.id = function(identifier) {
					identifier = resolveIdentifier(identifier);
					return identifier[0].require.id(identifier[1]);
				};

				module.require.async = function(identifier, loadedCallback) {
					identifier = resolveIdentifier(identifier);
					identifier[0].load(identifier[1], loadedCallback);
				};

				module.require.sandbox = function() {
					if (arguments.length === 3)
					{
						arguments[2].load = arguments[2].load || sandboxOptions.load;
					}
	                // If the `programIdentifier` (first argument) is relative it is resolved against the URI of the owning sandbox (not the owning page).
					if (/^\./.test(arguments[0]))
					{
					    arguments[0] = sandboxIdentifier + "/" + arguments[0];
					    // HACK: Temporary hack as zombie (https://github.com/assaf/zombie) does not normalize path before sending to server.
					    arguments[0] = arguments[0].replace(/\/\.\//g, "/");
					}
					return sourcemint.sandbox.apply(null, arguments);
				}
				module.require.sandbox.id = sandboxIdentifier;

                // HACK: RequireJS compatibility.
                // TODO: Move this to a plugin.
                module.require.nameToUrl = function(identifier)
                {
                    return sandboxIdentifier + module.require.id(identifier);
                }

				module.load = function() {
					if (typeof moduleInitializers[moduleIdentifier] === "function") {
						
						var moduleInterface = {
							id: module.id,
							exports: undefined
						}

						// If embedded in bundle `isMain` will be set to `true` if bundle was `require.main`.
				        if (packageIdentifier === "" && pkg.main === moduleIdentifier && sandboxOptions.isMain === true) {
				        	module.require.main = moduleInterface;
				        }

						if (sandboxOptions.onInitModule) {
							sandboxOptions.onInitModule(moduleInterface, module, pkg, sandbox);
						}

						var exports = moduleInitializers[moduleIdentifier](module.require, module.exports, moduleInterface);
						if (typeof moduleInterface.exports !== "undefined") {
							module.exports = moduleInterface.exports;
						} else
						if (typeof exports !== "undefined") {
							module.exports = exports;
						}
					} else
					if (typeof moduleInitializers[moduleIdentifier] === "string") {
						// TODO: Use more optimal string encoding algorythm to reduce payload size?
						module.exports = decodeURIComponent(moduleInitializers[moduleIdentifier]);
					} else {
						module.exports = moduleInitializers[moduleIdentifier];
					}
				};

				/*DEBUG*/ module.getReport = function() {
				/*DEBUG*/ 	var exportsCount = 0,
				/*DEBUG*/ 		key;
				/*DEBUG*/ 	for (key in module.exports) {
				/*DEBUG*/ 		exportsCount++;
				/*DEBUG*/ 	}
				/*DEBUG*/ 	return {
				/*DEBUG*/ 		exports: exportsCount
				/*DEBUG*/ 	};
				/*DEBUG*/ };

				return module;
			};

			pkg.load = function(moduleIdentifier, loadedCallback) {
                load(((!/^\//.test(moduleIdentifier))?"/"+libPath:"") + moduleIdentifier, packageIdentifier, function() {
                    loadedCallback(pkg.require(moduleIdentifier).exports);                           
                });
			}

			pkg.require = function(moduleIdentifier) {
				var loadingBundlesCallbacks;
                if (!/^\//.test(moduleIdentifier)) {
                    moduleIdentifier = "/" + libPath + moduleIdentifier;
                }
				moduleIdentifier = packageIdentifier + moduleIdentifier;
				if (!initializedModules[moduleIdentifier]) {
					/*DEBUG*/ if (!moduleInitializers[moduleIdentifier]) {
					/*DEBUG*/ 	throw new Error("Module '" + moduleIdentifier + "' not found in sandbox '" + sandbox.id + "'!");
					/*DEBUG*/ }
					(initializedModules[moduleIdentifier] = Module(moduleIdentifier)).load();
				}
				if (loadingBundles[moduleIdentifier]) {
					loadingBundlesCallbacks = loadingBundles[moduleIdentifier];
					delete loadingBundles[moduleIdentifier];
					for (var i=0 ; i<loadingBundlesCallbacks.length ; i++) {
						loadingBundlesCallbacks[i](sandbox);
					}
				}
				return initializedModules[moduleIdentifier];
			}

            pkg.require.id = function(moduleIdentifier) {
                if (!/^\//.test(moduleIdentifier)) {
                    moduleIdentifier = "/" + libPath + moduleIdentifier;
                }
                return (((packageIdentifier !== "")?"/"+packageIdentifier+"/":"") + moduleIdentifier).replace(/\/+/g, "/");
            }

			/*DEBUG*/ pkg.getReport = function() {
			/*DEBUG*/ 	return {
			/*DEBUG*/ 		mappings: mappings
			/*DEBUG*/ 	};
			/*DEBUG*/ }

			if (sandboxOptions.onInitPackage) {
				sandboxOptions.onInitPackage(pkg, sandbox, {
					finalizeLoad: finalizeLoad,
					moduleInitializers: moduleInitializers
				});
			}

			packages[packageIdentifier] = pkg;

			return pkg;
		}

		// Get a module and initialize it (statically link its dependencies) if it is not already so
		sandbox.require = function(moduleIdentifier) {
			return Package("").require(moduleIdentifier);
		}

		// Call the 'main' module of the program
		sandbox.boot = function() {
			/*DEBUG*/ if (typeof Package("").main !== "string") {
			/*DEBUG*/ 	throw new Error("No 'main' property declared in '/package.json' in sandbox '" + sandbox.id + "'!");
			/*DEBUG*/ }
			return sandbox.require(Package("").main).exports;
		};

		// Call the 'main' exported function of the main' module of the program
		sandbox.main = function() {
			var exports = sandbox.boot();
			return ((exports.main)?exports.main.apply(null, arguments):undefined);
		};

		/*DEBUG*/ sandbox.getReport = function() {
		/*DEBUG*/ 	var report = {
		/*DEBUG*/ 			bundles: {},
		/*DEBUG*/ 			packages: {},
		/*DEBUG*/ 			modules: {}
		/*DEBUG*/ 		},
		/*DEBUG*/ 		key;
		/*DEBUG*/ 	for (key in bundleIdentifiers) {
		/*DEBUG*/ 		report.bundles[key] = bundleIdentifiers[key];
		/*DEBUG*/ 	}
		/*DEBUG*/ 	for (key in packages) {
		/*DEBUG*/ 		report.packages[key] = packages[key].getReport();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	for (key in moduleInitializers) {
		/*DEBUG*/ 		if (initializedModules[key]) {
		/*DEBUG*/ 			report.modules[key] = initializedModules[key].getReport();
		/*DEBUG*/ 		}
		/*DEBUG*/ 	}
		/*DEBUG*/ 	return report;
		/*DEBUG*/ }

		load(".js", "", loadedCallback);

		return sandbox;
	};


	// The global `require` for the 'external' (to the loader) environment.
	var Loader = function() {

		var 
			/*DEBUG*/ bundleIdentifiers = {},
			sandboxes = {};

		var Require = function(bundle) {

				// Address a specific sandbox or currently loading sandbox if initial load.
				this.bundle = function(uid, callback) {
					/*DEBUG*/ if (typeof bundle !== "undefined") {
					/*DEBUG*/ 	throw new Error("You cannot nest require.bundle() calls!");
					/*DEBUG*/ }
					/*DEBUG*/ if (uid && bundleIdentifiers[uid]) {
					/*DEBUG*/ 	throw new Error("You cannot split require.bundle(UID) calls where UID is constant!");
					/*DEBUG*/ }
					/*DEBUG*/ bundleIdentifiers[uid] = true;
					var moduleInitializers = {},
						req = new Require(uid);
					// Store raw module in loading bundle
					req.memoize = function(moduleIdentifier, moduleInitializer) {
						moduleInitializers[moduleIdentifier] = moduleInitializer;
					}
					callback(req);
					loadedBundles.push([uid, moduleInitializers]);
				}
			};

		var require = new Require();

		// TODO: @see URL_TO_SPEC
		require.supports = [
			"ucjs2-pinf-0"
		];

		// Create a new environment to memoize modules to.
		// If relative, the `programIdentifier` is resolved against the URI of the owning page (this is only for the global require).
		require.sandbox = function(programIdentifier, loadedCallback, options) {
			var sandboxIdentifier = programIdentifier.replace(/\.js$/, "");
			return sandboxes[sandboxIdentifier] = Sandbox(sandboxIdentifier, loadedCallback, options || {});
		}
		
		/*DEBUG*/ require.getReport = function() {
		/*DEBUG*/ 	var report = {
		/*DEBUG*/ 			sandboxes: {}
		/*DEBUG*/ 		},
		/*DEBUG*/ 		key;
		/*DEBUG*/ 	for (key in sandboxes) {
		/*DEBUG*/ 		report.sandboxes[key] = sandboxes[key].getReport();
		/*DEBUG*/ 	}
		/*DEBUG*/ 	return report;
		/*DEBUG*/ }

		return require;
	}


	sourcemint = Loader();


	// Ignore `require` global if already exists.
    if (!require) {
        require = sourcemint;
    }

	// Export `require` for CommonJS if `exports` global exists.
	if (typeof exports === "object") {
		exports.require = sourcemint;
	}

}(this, (typeof document !== "undefined")?document:null));    };
    if (typeof sourcemint === "undefined") {
        sourcemint = {};
        var LOADER_INJECTED = {};
        initLoader(LOADER_INJECTED);
        (function(require, exports) {
            /**
 * Copyright: 2012 Christoph Dorn <christoph@christophdorn.com>
 * License: MIT
 */

// When embedded in bundle `LOADER_INJECTED` is populated with the `require("sourcemint-loader-js/loader")` exports.
var LOADER;
if (typeof LOADER_INJECTED !== "undefined") {
	LOADER = LOADER_INJECTED;
} else {
	LOADER = require("sourcemint-loader-js/loader");
}
var VM = require("vm"),
    PATH = require("path"),
    FS = require("fs"),
    HTTP = require("http"),
    HTTPS = require("https");


// TODO: Only enable this in debug mode.
process.on("uncaughtException", function (err)
{
    // NOTE: `err.stack` seems to be useless here.
    console.error("Uncaught exception: " + err);
});	

exports.getReport = LOADER.require.getReport;

exports.sandbox = function(sandboxIdentifier, loadedCallback, sandboxOptions)
{
	sandboxOptions = sandboxOptions || {};

	var options = {},
		key;
	
	for (key in sandboxOptions)
	{
		options[key] = sandboxOptions[key];
	}
	
	// Set our own loader for the sandbox.
	options.load = function(uri, loadedCallback)
    {
		exports.resolveURI(uri, function(err, uri)
		{
			if (err)
			{
				throw err;
			}

			exports.loadBundleCode(uri, function(err, code)
			{
				if (err)
				{
					throw err;
				}

			    try
			    {
			    	evalBundle(uri, code);

			        loadedCallback();		        
			    }
			    catch(err)
			    {
			    	throw err;
			    }
			});
		});
	}
	
	function evalBundle(uri, code)
	{
    	// NOTE: If there are sytnax errors in code this will print
    	//		 error to stdout (if fourth argument set to `true`).
    	//		 There is no way to capture errors from here.
    	// @see https://github.com/joyent/node/issues/1307#issuecomment-1551157
    	// TODO: Find a better solution to handle errors here.
    	// TODO: Capture errors by watching this processe's stdout file log from
    	//		 another process.
        VM.runInNewContext(code, {
		    // TODO: Inject and fix environment based on options.
        	require: LOADER.require,
        	// TODO: Wrap to `console` object provided by `sandboxOptions` and inject module info.
        	console: console,
        	// NodeJS globals.
        	// @see http://nodejs.org/docs/latest/api/globals.html
        	global: global,
        	process: process,
        	Buffer: Buffer,
        	setTimeout: setTimeout,
        	clearTimeout: clearTimeout,
        	setInterval: setInterval,
        	clearInterval: clearInterval
        }, uri, true);
	}

	options.onInitModule = function(moduleInterface, moduleObj, pkg)
	{
		if (sandboxOptions.onInitModule)
		{
			sandboxOptions.onInitModule(moduleInterface, moduleObj);
		}

		// @see http://nodejs.org/docs/latest/api/globals.html
		
		// TODO: Implement `require.cache`. Will need proxies to do that.

		moduleObj.require.resolve = function()
		{
			return moduleObj.require.id.apply(null, arguments);
		}
	};
	
	options.onInitPackage = function(pkg, sandbox, options)
	{
		var origRequire = pkg.require;
		pkg.require = function(moduleIdentifier)
		{
            var canonicalId = (pkg.id + "/" + moduleIdentifier).replace(/\/+/, "/");

            // HACK
			// TODO: Use a better flag than '__' to indicate that module should be loaded here!
			if (pkg.id === "__nodejs.org/0__")
			{
				return {
					exports: require(moduleIdentifier.replace(/\.js$/, ""))
				};
			}
			else
			if (typeof options.moduleInitializers[canonicalId] === "undefined")
			{
				// TODO: Check if module is memoized. If not we assume we need to load bundle.
                // Check if `moduleIdentifier` resolves to a new bundle file on the local filesystem.

				var path = sandbox.id + "/" + canonicalId;

				if (PATH.existsSync(path))
				{
					// Load the bundle SYNCHRONOUSLY as new modules must be available before we return.
			    	evalBundle(path, FS.readFileSync(path, "utf8"));

			    	// Activate the new modules from the bundle.
			    	options.finalizeLoad(path, pkg.id);

			    	// Now let the loader continue.
					return origRequire(moduleIdentifier);
				}
	            else
	            {
	                return origRequire(moduleIdentifier);
	            }
			}
            else
            {
                return origRequire(moduleIdentifier);
            }
		};
		
		pkg.require.id = origRequire.id;
	}
	
	LOADER.require.sandbox(sandboxIdentifier, function(sandbox)
	{
		loadedCallback(sandbox);
	}, options);
}


// TODO: Relocate this to github.com/pinf/core-js/lib/resolver.js and return PINF URI info object.
//		 Keep stub here for local FS uris so this module can be embedded in bundles without outside dependencies.
exports.resolveURI = function(uri, callback)
{
	var m;

	// The github case.
	// TODO: Match various vendor APIS.
	if (m = uri.match(/^(github.com\/sourcemint\/loader-js\/0)\/-raw\/(.*)$/))
	{
		// TODO: Get `/pinf/workspaces` from `ENV.PINF_WORKSPACES` implemented at github.com/pinf/core-js/lib/env.js

		if (m[1] !== "github.com/sourcemint/loader-js/0") {
			callback(new Error("Only the 'github.com/sourcemint/loader-js/0' package is supported at this time!"));
			return;
		}

		callback(null, require.resolve("sourcemint-loader-js/" + m[2]));
	}
	else
	if (m = uri.match(/^http(s)?:\/\/([^\/]*)(.*)$/))
	{
		callback(null, uri);
	}
	else
	if (m = uri.match(/^(\/.*)$/))
	{
		callback(null, uri);
	}
	else
	{
		callback(new Error("Unable to resolve URI: " + uri));
	}
}

// TODO: Relocate this to github.com/sourcemint/downloader-js/lib/bundle.js#loadBundleCode
//		 Keep stub here for local FS uris so this module can be embedded in bundles without outside dependencies.
exports.loadBundleCode = function(uri, callback)
{
	var m;
	
	try
	{
		// Check for local absolute file path.
		if (m = uri.match(/^(\/.*)$/))
		{
			// TODO: Pass this implementation as `options.readFile` to github.com/sourcemint/downloader-js/lib/bundle.js#loadBundleCode
			FS.readFile(uri, "utf8", function(err, code)
			{
				if (err)
				{
					// TODO: Throw a nice error object.
					console.log("Error reading file: " + uri);
			    	callback(err);
			    	return;
				}
	
				callback(null, code);
			});
		}
		else
		// Check for HTTP(S) URI.
		if (m = uri.match(/^http(s)?:\/\/([^\/]*)(.*)$/))
		{
			// TODO: Relocate to github.com/sourcemint/downloader-js/lib/fetcher.js
			((m[1])?HTTPS:HTTP).get({
				host: m[2],
				path: (m[3])?m[3]:"/"
			}, function(response)
			{
				if (response.statusCode !== 200)
				{
			    	// TODO: Bubble this up to the loader's error handler.
					callback(new Error("Did not get status 200 for URL: " + uri));
					return;
				}
		
				var code = [];
		
				response.on("data", function(chunk)
				{
					code.push(chunk);
			    });
		
				response.on("end", function()
				{
					callback(null, code.join(""));
			    });
		
			}).on("error", function(err)
			{
		    	callback(err);
			});
		}
		else
		{
			callback(new Error("Unable to load bundle code from URI: " + uri));
		}
	}
	catch(err)
	{
		callback(err);
	}
}


        })(require, sourcemint);
        var platformRequire = require;
        var isMain = ((platformRequire && platformRequire.main === module)?true:false);
        require = LOADER_INJECTED.require;
        sourcemint.sandbox(((typeof __dirname !== "undefined")?__dirname:".") + "/02-ConnectServer.js", function(sandbox) {
            if (typeof exports === "object") {
                var mainExports = sandbox.boot();
                if (typeof mainExports === "function") {
                    module.exports = mainExports;
                } else {
                    for (var key in mainExports) {
                        exports[key] = mainExports[key];
                    }
                }
            } else {
                sandbox.main();
            }
        }, {
            rootBundleLoader: rootBundleLoader,
            isMain: isMain
        });
    } else {
        rootBundleLoader();
    }
})();
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js":{"staticLinks":{"connect":"connect/index.js"},"dynamicLinks":{},"fileMtime":1329280339000,"treatAs":"js-module"}},"mappings":{"connect":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js":{"staticLinks":{"./lib/connect":"./lib/connect"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js":{"staticLinks":{"./http":"./http","./https":"./https","fs":"__nodejs__/fs","./patch":"./patch","./utils":"./utils"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js":{"staticLinks":{"http":"__nodejs__/http","url":"__nodejs__/url","assert":"__nodejs__/assert"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js":{"staticLinks":{"./http":"./http","https":"__nodejs__/https"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js":{"staticLinks":{"crypto":"__nodejs__/crypto","path":"__nodejs__/path","fs":"__nodejs__/fs"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js":{"staticLinks":{"connect":"connect/index.js"},"dynamicLinks":{},"fileMtime":1329280339000,"treatAs":"js-module"}},"mappings":{"connect":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js":{"staticLinks":{"./lib/connect":"./lib/connect"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js":{"staticLinks":{"./http":"./http","./https":"./https","fs":"__nodejs__/fs","./patch":"./patch","./utils":"./utils"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js":{"staticLinks":{"http":"__nodejs__/http","url":"__nodejs__/url","assert":"__nodejs__/assert"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js":{"staticLinks":{"./http":"./http","https":"__nodejs__/https"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js":{"staticLinks":{"crypto":"__nodejs__/crypto","path":"__nodejs__/path","fs":"__nodejs__/fs"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/07-DemoBundles/dist-bundled-loader/02-ConnectServer.js","packages":{"da0f9c24e679667d8e82ed043cd894e6da4c23d3":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect","043956adb8f7b26566da4cdc0e2ca286566dc494":"nodejs.org/0"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/index.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/connect.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/http.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/https.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/patch.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/utils.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js"}}}
