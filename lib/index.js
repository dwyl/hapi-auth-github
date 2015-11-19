var OPTIONS;      // global object set when plugin loads
var request      = require('./http_request');
var querystring  = require('querystring'); // nodejs.org/api/querystring.html
var redis_client = require('redis-connection')();

function make_post_data (request) {
  return querystring.stringify({
    client_id     : process.env.GITHUB_CLIENT_ID,
    client_secret : process.env.GITHUB_CLIENT_SECRET,
    code          : request.query.code,
    state         : request.query.state
  });
}

/**
 * http.request options for requesting the OAuth2 token
 * see: https://developer.github.com/v3/oauth/#github-redirects-back-to-your-site
 */
function token_options (post_data) {
  return {
    hostname : 'github.com',
    path     : '/login/oauth/access_token',
    method   : 'POST',
    port     : 443,
    headers  : {
      'Accept'        : 'application/json',
      'Content-Type'  : 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    body     : post_data // see make_post_data above
  };
}
/**
 * http request to get the profile of the person that just authenticated
 * see: https://developer.github.com/v3/users/#get-the-authenticated-user
 */
function user_options (access_json) {
  var access_token = 'token ' + access_json.access_token;
  return {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    port: 443,
    headers: {
      authorization : access_token,
      'Accept'      : 'application/json',
      'User-Agent'  : 'hapi-auth-github' // a User-Agent is *REQUIRED*!!
    }
  };
}

/**
 * this plugin creates the github Oauth Callback URL
 * e.g: /googleauth where github calls back to with the OAuth code
 */

exports.register = function githubauth (server, options, next) {
  // should we check the options have been set?
  OPTIONS = options;
  // server.decorate('server', 'generate_google_oauth2_url', generate_google_oauth2_url)
  server.route([
    {
      method: 'GET', // ping
      path: OPTIONS.REDIRECT_URL, // must be identical to Authorized callback URL
      handler: function github_oauth_get_tokens_and_user_profile (req, reply) {
        console.log(' - - - - - - - - - - - - code:');
        console.log(req.query.code);
        var post_data = make_post_data(req);
        var options   = token_options(post_data);
        console.log(options)
        request(options, function(oauth_access_token_json) {
          console.log(' - - - - - - - - - - - - - - - - - - - response:');
          console.log(oauth_access_token_json);
          var options = user_options(oauth_access_token_json);
          console.log(' - - - - - - - - - - - - - - - - - - - user options:');
          console.log(options);
          request(options, function(profile) {
            OPTIONS.handler(req, reply, oauth_access_token_json, profile);
            // reply(JSON.stringify(profile), null, 2);
          })
        });
      }
    }
  ]);

  next(); // everything worked, continue booting the hapi server!
};

exports.register.attributes = {
    pkg: require('../package.json')
};
