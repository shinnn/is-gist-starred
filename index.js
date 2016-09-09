/*!
 * is-gist-starred | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/is-gist-starred
*/
'use strict';

const ghGet = require('gh-get');

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

  const verbose = options.verbose;

  options = Object.assign({}, options, {
    verbose: typeof verbose === 'boolean' ? true : verbose
  });

  options.headers = Object.assign({
    'user-agent': 'https://github.com/shinnn/is-gist-starred'
  }, options.headers);

  return ghGet(`gists/${gistId}/star`, options).then(() => Promise.resolve(true), err => {
    if (err.message === '404 Not Found') {
      if (err.response.body && 'message' in err.response.body) {
        err.message += ` (Gist not found: https://gist.github.com/${gistId})`;
      } else {
        return Promise.resolve(false);
      }
    }

    if (!verbose) {
      delete err.response;
    }

    return Promise.reject(err);
  });
};
