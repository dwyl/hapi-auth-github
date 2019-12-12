var querystring = require('querystring')
var crypto = require('crypto')
const Wreck = require('@hapi/wreck')

var OPTIONS = {};

function make_post_data(req) {
    return querystring.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
        state: req.query.state
    });
}
async function getToken(post_data) {
    var options = {
        payload: post_data,
        hostname: process.env.GITHUB_HOSTNAME || 'github.com'
    }
    const promise = await Wreck.request('POST', 'https://' + options.hostname + '/login/oauth/access_token', options)
    return new Promise(async (resolve, reject) => {
        const res = await promise;
        const body = await Wreck.read(res, options)
        let res_json = querystring.parse(body.toString())
        if (!res_json.error) {
            resolve(res_json)
        } else {
            reject(res_json)
        }
    })
}
async function getUser(access_json) {
    var options = {
        headers: {
            'Authorization': 'token ' + access_json.access_token,
            'Accept': 'application/json',
            'User-Agent': 'maixiaojie-auth-github'
        },
        hostname: process.env.GITHUB_API_HOSTNAME || 'api.github.com'
    }
    const promise = await Wreck.request('GET', 'https://' + options.hostname + '/user', options)
    return new Promise(async (resolve, reject) => {
        const res = await promise;
        const body = await Wreck.read(res, options)
        let res_body = body.toString()
        let res_json = JSON.parse(res_body)
        if (!res_json.error) {
            resolve(res_json)
        } else {
            reject(res_json)
        }
    })
}
const githubHandle = async function (req, h) {
    let post_data = make_post_data(req)
    try {
        let access_json = await getToken(post_data)
        let user = await getUser(access_json)
        return OPTIONS.handler(req, h, access_json, user);
    }catch(e) {
        return {
            error: e
        }
    }
}
const getLoginUrl = function () {
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
}

const internals = { handler: githubHandle, getLoginUrl: getLoginUrl }
export const github_auth = {
    name: 'github-auth',
    version: '1.0.0',
    pkg: require('../package.json'),
    requirements: {
      hapi: '>=17.0.0'
  },
    login_url: internals.getLoginUrl,
    register: async function (server, options) {
        OPTIONS = options
        server.route([
            {
                method: 'GET',
                path: process.env.GITHUB_AUTH_REDIRECT_URL,
                config: { auth: false },
                handler: internals.handler
            }
        ])
    }
}