var test = require('tape');
var nock = require('nock');
var dir  = __dirname.split('/')[__dirname.split('/').length-1];
var file = dir + __filename.replace(__dirname, '') + " > ";

var server = require('../example/github.server.js');

test(file+'Visit / root url expect to see a link', function(t) {
  var options = {
    method: "GET",
    url: "/"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    server.stop(function(){ });
    t.end();
  });
});

// test a bad code does not crash the server!
test(file+'/googleauth?code=oauth2codehere', function(t) {
  var options = {
    method: "GET",
    url: "/googleauth?code=badcode"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    t.ok(response.payload.indexOf('something went wrong') > -1,
          'Got: '+response.payload + ' (As Expected)');
    server.stop(function(){ });
    t.end();
  });
});


test(file+'Mock /googleauth?code=oauth2codehere', function(t) {
  // google oauth2 token request url:
  var fs = require('fs');
  var token_fixture = fs.readFileSync('./test/fixtures/sample-auth-token.json');
  var nock = require('nock');
  var scope = nock('https://accounts.google.com')
            .persist() // https://github.com/pgte/nock#persist
            .post('/o/oauth2/token')
            .reply(200, token_fixture);

  // see: http://git.io/v4nTR for google plus api url
  // https://www.googleapis.com/plus/v1/people/{userId}
  var sample_profile = fs.readFileSync('./test/fixtures/sample-profile.json');
  var nock = require('nock');
  var scope = nock('https://www.googleapis.com')
            .get('/plus/v1/people/me')
            .reply(200, sample_profile);

  var options = {
    method: "GET",
    url: "/googleauth?code=myrandomtoken"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    var expected = 'Hello Alex You Logged in Using Goolge!';
    t.equal(response.payload, expected, "")
    console.log(' - - - - - - - - - - - - - - - - - -');
    console.log(response.payload);
    console.log(' - - - - - - - - - - - - - - - - - -');
    server.stop(function(){ });
    t.end();
  });
});
