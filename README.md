# hapi auth *github* <small>lets you</small> <img width="300" alt="login with google" src="https://cloud.githubusercontent.com/assets/194400/11214293/4e309bf2-8d38-11e5-8d46-b347b2bd242e.png">

**GitHub Authentication** Plugin for Hapi.js Apps with ***detailed documentation***.

[![Build Status](https://travis-ci.org/dwyl/hapi-auth-github.svg)](https://travis-ci.org/dwyl/hapi-auth-github)
[![codecov.io](https://codecov.io/github/dwyl/hapi-auth-github/coverage.svg?branch=master)](https://codecov.io/github/dwyl/hapi-auth-github?branch=master)
[![Code Climate](https://codeclimate.com/github/dwyl/hapi-auth-github/badges/gpa.svg)](https://codeclimate.com/github/dwyl/hapi-auth-github)
[![Dependency Status](https://david-dm.org/dwyl/hapi-auth-github.svg)](https://david-dm.org/dwyl/hapi-auth-github)
[![devDependency Status](https://david-dm.org/dwyl/hapi-auth-github/dev-status.svg)](https://david-dm.org/dwyl/hapi-auth-github#info=devDependencies)

## Why?

We use *GitHub* for ***all*** our coding projects and are building
a tool to keep track of all these: https://github.com/dwyl/tudo

Given that other people will have projects that need GitHub Authentication,  
we've separated our Auth code into this re-useable Hapi Plugin.

## How?

We are using the GitHub Auth Web Application flow:  
https://developer.github.com/v3/oauth/#web-application-flow

### 1. Install `hapi-auth-github` from NPM

Install the plugin from npm and save it to your `package.json`:

```sh
npm install hapi-auth-github --save
```

### 2. Create an App on GitHub

Follow the instructions in:
[GITHUB-APP-STEP-BY-STEP-GUIDE.md](https://github.com/dwyl/hapi-auth-github/blob/master/GITHUB-APP-STEP-BY-STEP-GUIDE.md)



## Background Reading

+ Basics: https://developer.github.com/guides/basics-of-authentication
