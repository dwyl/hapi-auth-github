# `hapi-github-auth` makes it *easy* 

**GitHub Authentication** Plugin for Hapi.js(V17+) Apps with ***detailed documentation***.

## How?

If you're *new* to GitHub Authentication, and want to *understand* how it works, read the GitHub OAuth Web Application flow:  
https://developer.github.com/v3/oauth/#web-application-flow

*Or*, if you just need to get up and running *fast*, follow these simple steps:

### 1. Install `hapi-github-auth` from NPM

Install the plugin from npm and save it to your `package.json`:

```sh
npm install hapi-github-auth --save
```

### 2. Create an App on GitHub

Follow the instructions in:
[GITHUB-APP-STEP-BY-STEP-GUIDE.md](https://github.com/maixiaojie/hapi-github-auth/blob/master/GITHUB-APP-STEP-BY-STEP-GUIDE.md)

### 3. Export the *Required* Environment Variables

Once you've created your app following the [*GitHub App Step-by-Step Guide*](https://github.com/maixiaojie/hapi-github-auth/blob/master/GITHUB-APP-STEP-BY-STEP-GUIDE.md)

Export the Environment Variables:
```sh
# same as Authorized JavaScript Origin
BASE_URL=http://localhost:3001 
GITHUB_CLIENT_ID=YourGitHubClientID
GITHUB_CLIENT_SECRET=SuperSecret
GITHUB_AUTH_REDIRECT_URL=/githubauth
PORT=3001

# Optionals
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
// github_handler.js
const custom_handler = function (req, h, access_token_json, userinfo) {
    console.log(access_token_json, userinfo)
    // your handle ...
    return {
      // something
    }
}

export default custom_handler
```

### 5. Register the Plugin into your Hapi.js Server

The final step is to register the plugin into your Hapi.js Server
declaring your desired options:

```js
// declare your desired options for the plugin
import custom_handler from '../auth/github_handler.js'
var pluginOption = {
  plugin: require('hapi-github-auth'),
  options: {
      SCOPE: 'user',
      handler: custom_handler
  }
};

server.register(pluginOption);
```

#### `options` *explained*

+ `handler` - the handler you defined above in **step 4**
which is your custom logic for GitHub auth enabled app.
+ `SCOPE` - these are the ***permissions*** your app is requesting.


