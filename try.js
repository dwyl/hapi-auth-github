require('env2')('.env');
var crypto = require('crypto');    // http://nodejs.org/api/crypto.html
var querystring   = require('querystring'); // nodejs.org/api/querystring.html
var hash = crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
console.log(hash);
var params = {
  client_id : process.env.GITHUB_CLIENT_ID,
  redirect_uri : 'http://localhost:8000/githubauth',
  scope : 'repo',
  state: hash
}
console.log(params);
var qs = querystring.stringify(params);
console.log(qs);
var url = 'https://github.com/login/oauth/authorize' + '?' + qs;
console.log(url);


var assert = require('assert');
require('env2')('.env');
// console.log(process.env);
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: Number(process.env.PORT)
});

var opts = {
  REDIRECT_URL: '/githubauth',  // must match google app redirect URI
  handler: require('./example/github_oauth_handler.js'), // your handler
  scope: 'email' // profile
};

var hapi_auth_google = require('./lib');

server.register([{ register: require('./lib'), options:opts }], function (err) {
  // handle the error if the plugin failed to load:
  assert(!err, "FAILED TO LOAD PLUGIN!!! :-("); // fatal error
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(req, reply) {
		var imgsrc = 'https://developers.google.com/accounts/images/sign-in-with-google.png';
		var btn = '<a href="' + url +'"><img src="' +imgsrc +'" alt="Login With Google"></a>'
    reply(btn);
  }
});

server.start(function(err){ // boots your server
  assert(!err, "FAILED TO Start Server");
	console.log('Now Visit: http://localhost:'+server.info.port);
});

module.exports = server;

/*
var https         = require('https');

var redis_client  = require('redis-connection')();

function make_post_data (request) {
  return querystring.stringify({
    client_id     : process.env.GITHUB_CLIENT_ID,
    client_secret : process.env.GITHUB_CLIENT_SECRET,
    code          : request.query.code
  });
}

function make_options (post_data) {
  return {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      'Accept'        : 'application/json',
      'Content-Type'  : 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };
}

/* redis_login_handler stores access_token for later use
 * @param {String} access_json - the string returned by github auth
 * @param {Function} callback - call this when redis replies
 */

/*
function redis_login_handler (access_json, callback) {
  var access_token = 'token ' + JSON.parse(access_json).access_token;
  https.get({
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      authorization: access_token,
      'User-Agent': 'Tudo'
    }
  }, function (res){
    access_token = access_token.split(' ')[1];
    var user_name = '';
    res.setEncoding('utf-8');
    res.on('data', function (chunk){
      user_name += chunk;
    }).on('end', function(){
      user_name = JSON.parse(user_name).login;
      redis_client.hset('tokens', user_name, access_token, callback);
    })
  });
}

function token_response_handler (response) {
  var json_string = '';
  response.setEncoding('utf-8');
  response.on('data', function (chunk){
    json_string += chunk;
  });
  response.on('end', function(){redis_login_handler(json_string)});
}

function get_access_token (request, reply) {
  var post_data = make_post_data(request);
  var options   = make_options(post_data);
  var req = https.request(options, token_response_handler);
  req.write(post_data);
  req.end();
}

function authentication_handler (request, reply) {
  var body = riot.render(views.login);
  reply(views.header + body + views.footer);
  if (request.query && request.query.code) { get_access_token(request, reply); }
}

module.exports = authentication_handler;
module.exports.redis_login_handler = redis_login_handler;
module.exports.redis_client = redis_client;
*/
