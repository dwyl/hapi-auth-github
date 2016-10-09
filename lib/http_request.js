'use strict';

var http = require('https'); // ALWAYS use TLS over the internets!

/**
* request is a bare-bones http request using node.js core http module
* see: https://nodejs.org/api/http.html#http_http_request_options_callback
* @param {Object} options - any valid request options (e.g. method or path)
* @param {Function} callback - called once request has finished
* @returns {Boolean} callback - no point returning anything else ...!
*/
module.exports = function request (options, callback) {
  var file = __filename;
  var msg = 'http.request requires valid http request options';
  var req; // http request defined below

  if (!options || !options.hostname || !options.port || !options.path) {
    throw new Error('ERROR: ' + file + ':17 \n' + msg);
  }
  // check for existence of a callback function
  if (!callback || typeof callback !== 'function') {
    msg = 'http.request is Asynchronous, callback required as second param!';
    throw new Error('ERROR: ' + file + ':21 \n' + msg);
  }
  req = http.request(options, function (res) {
    var resStr = '';
    var response;

    // console.log('STATUS: ' + res.statusCode);
    if (res.statusCode !== 200) {
      return callback(200);
    }
    // console.log('HEADERS: ' + JSON.stringify(res.headers, null, 2));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      resStr += chunk;
    }).on('end', function () {
      response = JSON.parse(resStr);

      return callback(null, response); // return response as object
    });

    return true;
  }).on('error', function (e) {
    return callback(e);
  });
  // write to request body if passed to options
  if (options.body) {
    req.write(options.body);
  }
  req.end();
};
