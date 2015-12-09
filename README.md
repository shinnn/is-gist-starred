# is-gist-starred

[![NPM version](https://img.shields.io/npm/v/is-gist-starred.svg)](https://www.npmjs.com/package/is-gist-starred)
[![Build Status](https://travis-ci.org/shinnn/is-gist-starred.svg?branch=master)](https://travis-ci.org/shinnn/is-gist-starred)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/is-gist-starred.svg)](https://coveralls.io/github/shinnn/is-gist-starred)
[![Dependency Status](https://david-dm.org/shinnn/is-gist-starred.svg)](https://david-dm.org/shinnn/is-gist-starred)
[![devDependency Status](https://david-dm.org/shinnn/is-gist-starred/dev-status.svg)](https://david-dm.org/shinnn/is-gist-starred#info=devDependencies)

Check if you have starred a given [gist](https://gist.github.com/) or not

```javascript
const isGistStared = require('is-gist-starred');

// https://gist.github.com/domenic/2790533
isGistStared('2790533', {token: 'xxxx'}).then(starred => {
  starred; //=> true
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install is-gist-starred
```

## API

```javascript
const isGistStarred = require('is-gist-starred');
```

### isGistStarred(*gistId* [, *options*])

*gistId*: `String` (a gist ID, for example [https://gist.github.com/tim/34309](https://gist.github.com/tim/34309) → `'34309'`)  
*options*: `Object` ([`Request` options](https://github.com/request/request#requestoptions-callback) and the [additional](https://github.com/shinnn/is-gist-starred#optionstoken) [ones](https://github.com/shinnn/is-gist-starred#optionsverbose))  
Return: [`Promise`](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-constructor) instance

It creates an API request to check if the [gist](https://help.github.com/articles/about-gists/) is starred by the authentificated user, and returns a promise.

When it gets the result successfully, the promise will be [*fulfilled*](https://promisesaplus.com/#point-26) with a `Boolean` value that shows whether the gist is starred or not.

When the request fails or the gist is not found, the promise will be [*rejected*](https://promisesaplus.com/#point-30) with an error.

#### options.token

Type: `String`  
Default: `process.env.GITHUB_TOKEN`

Use specific [GitHub access token](https://github.com/blog/1509-personal-api-tokens).

#### options.verbose

Type: `Boolean`  
Default: `false`

`true` adds an [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_http_incomingmessage) object to the error message as `response` property.

```javascript
isGistStarred('2790533', {token: 'invalid_token'}).then(err => {
  err.message; //=> 'Bad credentials'
  'response' in error; //=> false
});

isGistStarred('2790533', {
  token: 'invalid_token',
  verbose: true
}).then(err => {
  err.message; //=> 'Bad credentials'
  err.response; //=> {statusCode: 401, body: { ... }, headers: { ... }, ...}
});
```

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
