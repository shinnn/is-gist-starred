/*!
 * is-gist-starred | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/is-gist-starred
*/
'use strict';

const fettuccine = require('fettuccine');
const ghifyRequestOptions = require('ghify-request-options');

module.exports = function isGistStarred(gistId, options) {
  if (typeof gistId !== 'string') {
    return Promise.reject(new TypeError(
      `${gistId} is not a string. Expected a Gist ID to check if starred. https://gist.github.com/`
    ));
  }

  if (gistId === '') {
    return Promise.reject(new Error(
      'Expected a Gist ID to check if starred, but received an empty string.'
    ));
  }

  options = Object.assign({verbose: false}, options);

  if (typeof options.verbose !== 'boolean') {
    return Promise.reject(new TypeError(
      String(options.verbose) +
      ' is not a Boolean value. `verbose` option must be a Boolean value.' +
      ' (`false` by default)'
    ));
  }

  options.headers = Object.assign({
    'user-agent': 'https://github.com/shinnn/is-gist-starred'
  }, options.headers);

  return fettuccine(`gists/${gistId}/star`, ghifyRequestOptions(options))
  .then(function getStarredOrNotFromResponse(response) {
    if (response.body && response.body.message) {
      const error = new Error(
        response.body.message === 'Not Found' ?
        `Gist not found: https://gist.github.com/${gistId}` :
        response.body.message
      );

      if (options.verbose) {
        error.response = response;
      }

      return Promise.reject(error);
    }

    return Promise.resolve(response.statusCode === 204);
  });
};
