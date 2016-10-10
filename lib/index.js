'use strict';

var OPTIONS;      // global object set when plugin loads
var crypto = require('crypto');      // http://nodejs.org/api/crypto.html
var pkg = require('../package.json');
var request = require('./http_request');
var querystring = require('querystring'); // nodejs.org/api/querystring.html

/**
 * make_post_data simply extracts the code and state (hash) from the request
 * and combines those data with the GitHub Client Id & Secret as a query string
 * @param {Object} req - the request object sent by GitHub with code & state
 * @returns {Object} the stringified object required to request OAuth2 Token
 */
function make_post_data (req) {
  return querystring.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
    state: req.query.state
  });
}

/**
 * http.request options for requesting the OAuth2 token
 * see: developer.github.com/v3/oauth/#github-redirects-back-to-your-site
 * @param {String} post_data the POST data we are sending to GitHub
 * @returns {Object} data & headers we are sending to GitHub in our HTTP request
 */
function token_options (post_data) {
  return {
    body: post_data, // see make_post_data above
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    },
    hostname: 'github.com',
    method: 'POST',
    path: '/login/oauth/access_token',
    port: 443
  };
}
/**
 * http request to get the profile of the person that just authenticated
 * see: https://developer.github.com/v3/users/#get-the-authenticated-user
 * @param {Object} access_json returned by GitHub OAuth access_token request.
 * @returns {Object} data & headers we are sending to GitHub in our HTTP request
 */
function user_options (access_json) {
  return {
    headers: {
      'Authorization': 'token ' + access_json.access_token,
      'Accept': 'application/json',
      'User-Agent': 'hapi-auth-github' // a User-Agent is *REQUIRED*!!
    },
    hostname: 'api.github.com',
    method: 'GET',
    path: '/user',
    port: 443
  };
}

/**
 * this plugin creates the github Oauth Callback URL
 * e.g: /githubauth where github calls back to with the OAuth code
 * @param {Object} server - the Hapi server object/instance
 * @param {Object} options - any valid request options (e.g. method or path)
 * @param {Function} next - called once plugin has been registered
 * @returns {Boolean} callback - no point returning anything else ...!
 */
exports.register = function githubauth (server, options, next) {
  OPTIONS = options; // should we check the options have been set?
  server.route([
    {
      method: 'GET', // ping
      path: process.env.GITHUB_AUTH_REDIRECT_URL, // must be identical to Authorized callback URL
      config: { auth: false },
      handler: function github_oauth_get_tokens_and_user_profile (req, reply) {
        var post_data = make_post_data(req);
        var options1 = token_options(post_data);

        request(options1, function (err, oauth_access_token_json) {
          var options2;
          var profile = null;

          server.log('error', err); // see: github.com/dwyl/hapi-error#logging
          options2 = user_options(oauth_access_token_json);

          request(options2, function (oauth_err, user_profile) {
            if (oauth_err) {
              server.log('error', oauth_err); // add "good" logging to see logs
            } else {
              profile = user_profile;
            }
            OPTIONS.handler(req, reply, oauth_access_token_json, profile);

            return true;
          });
        });
      }
    }
  ]);

  return next(); // everything worked, continue booting the hapi server!
};

exports.register.attributes = { pkg: pkg };

module.exports.login_url = function () {
  var params = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.BASE_URL + process.env.GITHUB_AUTH_REDIRECT_URL,
    scope: OPTIONS.SCOPE,
    state: crypto.createHash('sha256')
      .update(Math.random().toString())
      .digest('hex')
  };
  var qs = querystring.stringify(params);
  var url = 'https://github.com/login/oauth/authorize?' + qs;

  return url;
};
