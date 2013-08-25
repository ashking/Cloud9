// @sourcemint-bundle-ignore: 
sourcemint.bundle("", function(require)
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
// @sourcemint-bundle-report: {"sourceReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js":{"staticLinks":{"connect":"connect/index.js"},"dynamicLinks":{},"fileMtime":1329280339000,"treatAs":"js-module"}},"mappings":{"connect":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js":{"staticLinks":{"./lib/connect":"./lib/connect"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js":{"staticLinks":{"./http":"./http","./https":"./https","fs":"__nodejs__/fs","./patch":"./patch","./utils":"./utils"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js":{"staticLinks":{"http":"__nodejs__/http","url":"__nodejs__/url","assert":"__nodejs__/assert"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js":{"staticLinks":{"./http":"./http","https":"__nodejs__/https"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js":{"staticLinks":{"crypto":"__nodejs__/crypto","path":"__nodejs__/path","fs":"__nodejs__/fs"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"mappedReport":{"mainPackage":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer","packages":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js":{"staticLinks":{"connect":"connect/index.js"},"dynamicLinks":{},"fileMtime":1329280339000,"treatAs":"js-module"}},"mappings":{"connect":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect"}},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect":{"mainModule":{"path":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index"},"modules":{"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js":{"staticLinks":{"./lib/connect":"./lib/connect"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js":{"staticLinks":{"./http":"./http","./https":"./https","fs":"__nodejs__/fs","./patch":"./patch","./utils":"./utils"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js":{"staticLinks":{"http":"__nodejs__/http","url":"__nodejs__/url","assert":"__nodejs__/assert"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js":{"staticLinks":{"./http":"./http","https":"__nodejs__/https"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js":{"staticLinks":{"http":"__nodejs__/http"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"},"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js":{"staticLinks":{"crypto":"__nodejs__/crypto","path":"__nodejs__/path","fs":"__nodejs__/fs"},"dynamicLinks":{},"fileMtime":1332971498000,"treatAs":"js-module"}},"mappings":{"__nodejs__":"nodejs.org/0"}},"nodejs.org/0":{"mainModule":{},"modules":{},"mappings":{}}}},"bundleReport":{"mainBundle":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/07-DemoBundles/dist/02-ConnectServer.js","packages":{"da0f9c24e679667d8e82ed043cd894e6da4c23d3":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect","043956adb8f7b26566da4cdc0e2ca286566dc494":"nodejs.org/0"},"modules":{"/main.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/main.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/index.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/index.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/connect.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/connect.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/http.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/http.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/https.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/https.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/patch.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/patch.js","da0f9c24e679667d8e82ed043cd894e6da4c23d3/lib/utils.js":"/pinf/workspaces/github.com/sourcemint/platform-nodejs/0/examples/06-Demos/02-ConnectServer/node_modules/connect/lib/utils.js"}}}
