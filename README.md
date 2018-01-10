# `hapi-auth-github` makes it *easy* to <img width="300" alt="login with github" src="https://cloud.githubusercontent.com/assets/194400/11214293/4e309bf2-8d38-11e5-8d46-b347b2bd242e.png">

**GitHub Authentication** Plugin for Hapi.js Apps with ***detailed documentation***.

[![Build Status](https://travis-ci.org/dwyl/hapi-auth-github.svg)](https://travis-ci.org/dwyl/hapi-auth-github)
[![Test Coverage](https://img.shields.io/codecov/c/github/dwyl/hapi-auth-github.svg?maxAge=2592000)](https://codecov.io/github/dwyl/hapi-auth-github?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg)](https://github.com/dwyl/goodparts)
[![Code Climate](https://codeclimate.com/github/dwyl/hapi-auth-github/badges/gpa.svg)](https://codeclimate.com/github/dwyl/hapi-auth-github)
[![Dependency Status](https://david-dm.org/dwyl/hapi-auth-github.svg)](https://david-dm.org/dwyl/hapi-auth-github)
[![devDependencies Status](https://david-dm.org/dwyl/hapi-auth-github/dev-status.svg)](https://david-dm.org/dwyl/hapi-auth-github?type=dev)
## Why?

We use *GitHub* for ***all*** our coding projects and are building
a tool to keep track of all them: https://github.com/dwyl/tudo

Given that other people will have projects that need GitHub Authentication,  
we have *de-coupled* our OAuth code into this re-useable Hapi Plugin.

> If you have _any_ questions or would like to *contribute* to this module,
please get in touch:
[![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## *What*?

An easy-to-use Hapi.js plugin that gives you GitHub OAuth Authentication  
in a few simple steps and has *human-readable*, maintained code.

> Note: if you are new to Hapi check out:
https://github.com/dwyl/learn-hapi

## How?

If you're *new* to GitHub Authentication, and want to *understand* how it works, read the GitHub OAuth Web Application flow:  
https://developer.github.com/v3/oauth/#web-application-flow

*Or*, if you just need to get up and running *fast*, follow these simple steps:

### 1. Install `hapi-auth-github` from NPM

Install the plugin from npm and save it to your `package.json`:

```sh
npm install hapi-auth-github --save
```

### 2. Create an App on GitHub

Follow the instructions in:
[GITHUB-APP-STEP-BY-STEP-GUIDE.md](https://github.com/dwyl/hapi-auth-github/blob/master/GITHUB-APP-STEP-BY-STEP-GUIDE.md)

### 3. Export the *Required* Environment Variables

Once you've created your app following the [*GitHub App Step-by-Step Guide*](https://github.com/dwyl/hapi-auth-github/blob/master/GITHUB-APP-STEP-BY-STEP-GUIDE.md)

Export the Environment Variables:
```sh
BASE_URL=http://localhost:8000 # same as Authorized JavaScript Origin
GITHUB_CLIENT_ID=YourGitHubClientID
GITHUB_CLIENT_SECRET=SuperSecret
GITHUB_AUTH_REDIRECT_URL=/githubauth
PORT=8000

# Optionals
# (If you are using hapi-auth-jwt2)
JWT_SECRET=ItsNoSecretBecauseYouToldEverybody
# If you are using custom instance of GitHub
GITHUB_HOSTNAME=github.mycompany.com
GITHUB_API_HOSTNAME=api.github.mycompany.com
```

#### Notes on Environment Variables:

> Tip: If you (*or anyone on your team*) are new to
Environment Variables or need a refresher,  
see: [https://github.com/dwyl/**learn-environment-variables**](https://github.com/dwyl/learn-environment-variables)  

We named/exported the 5 variables prefixed with `GITHUB_`
to _distinguish_ them from other services you may be using which
may also have an environment variable named `CLIENT_ID`...

The `BASE_URL` is required to know which url your app is using.
it needs to be identical to the `Authorized JavaScript Origin`
that you set in step 2 above.

The `GITHUB_AUTH_REDIRECT_URL` is the url (*endpoint*) where GitHub will
send the initial OAuth2 `code` to _confirm_ your application is *real*.
Make *sure* that the url is *identical* to the one you defined when
setting up your app on GitHub. e.g: http://localhost:8000/githubauth

The `GITHUB_HOSTNAME` and `GITHUB_API_HOSTNAME` let's you define
other instance of GitHub e.g. enterprise. Defaults are `github.com`
and `api.github.com` accordingly.

### 4. Create Your (Custom) Handler Function

This is where you *decide* what to do with the person's `profile` details  
once they have authorized your App to use their GitHub details.

Your custom handler should have the following signature:
```js
function custom_handler(request, reply, tokens, profile) {
  // save the profile as a session so you can personalize their experience of your app
  // use the reply() to send a response/view to the visitor
}
```
The handler function parameters are:
+ **request** is the hapi request object with all the properties.
+ **reply** is the standard hapi reply object used to send your response to the client or send a rendered view.
+ ***tokens*** are the OAuth2 tokens returned by GitHub for the session
see: [**sample_auth_token.json**](https://github.com/dwyl/hapi-auth-github/blob/master/test/fixtures/sample-auth-token.json)
+ ***profile*** is the person's GitHub profile
see: [**sample_profile.json**](https://github.com/dwyl/hapi-auth-github/blob/master/test/fixtures/sample-profile.json)

> For an *example* custom_handler, see:
[example/**github_oauth_handler.js**](https://github.com/dwyl/hapi-auth-github/blob/605c9d59f6d26cbfbd2fbcf932fa9efb78d4aa5f/example/github_oauth_handler.js#L3)

### 5. Register the Plugin into your Hapi.js Server

The final step is to register the plugin into your Hapi.js Server
declaring your desired options:

```js
// declare your desired options for the plugin
var opts = {
  handler: require('./github_oauth_handler.js'), // your handler
  SCOPE: 'user' // ask for their public email address
};

server.register([{ register: require('hapi-auth-github'), options:opts }],
 function (err) {
  if(err){
    // handle the error if the plugin failed to load:  
  }
  // the rest of your app ...
});
```

#### `options` *explained*

+ `handler` - the handler you defined above in **step 4**
which is your custom logic for GitHub auth enabled app.
+ `SCOPE` - these are the ***permissions*** your app is requesting.


## Implementation Notes:

To run the *example* you will need an extra environment variable:
```sh
BASE_URL=http://localhost:8000 # same as Authorized JavaScript Origin
GITHUB_CLIENT_ID=YourGitHubClientID
GITHUB_CLIENT_SECRET=SuperSecret
GITHUB_AUTH_REDIRECT_URL=/githubauth
PORT=8000
# Optionally (If you are using hapi-auth-jwt2)
JWT_SECRET=ItsNoSecretBecauseYouToldEverybody
```

> Also, if you're wondering what that `JWT_SECRET` *Environment Variables* is for,  
see: [https://github.com/dwyl/**learn-json-web-tokens**](https://github.com/dwyl/learn-json-web-tokens)


## Background Reading

+ Basics: https://developer.github.com/guides/basics-of-authentication
+ Intro to OAuth2: https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2
+ GitHub OAuth Scopes: https://developer.github.com/v3/oauth/#scopes
(*what you should ask to access on a person' GitHub account*)
