'use strong';

const isGistStarred = require('.');
const test = require('tape');

process.env.GITHUB_TOKEN = '';

test('isGistStarred()', t => {
  t.plan(9);

  t.strictEqual(isGistStarred.name, 'isGistStarred', 'should have a function name.');

  isGistStarred('2790533', {token: process.env.IS_GIST_STARRED_TEST_TOKEN}).then(starred => {
    t.strictEqual(
      starred,
      true,
      'should be resolved with a boolean that shows whether the user starred the Gist or not.'
    );
  }).catch(t.fail);

  isGistStarred('9'.repeat(99), {token: process.env.IS_GIST_STARRED_TEST_TOKEN}).then(t.fail, err => {
    t.strictEqual(
      err.message,
      `404 Not Found (Gist not found: https://gist.github.com/${'9'.repeat(99)})`,
      'should fail when it cannot find the Gist with the given ID.'
    );
    t.notOk(
      'response' in err,
      'should not add `header` property to the error when `verbose` option is not enabled.'
    );
  }).catch(t.fail);

  isGistStarred('2790533', {
    token: 'FOO',
    verbose: true,
    headers: {'user-agenT': 'bar'}
  }).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '401 Unauthorized (Bad credentials)',
      'should fail when the token is not valid.'
    );
    t.deepEqual(
      err.response.req._headers['user-agent'], //eslint-disable-line
      'bar',
      'should add `header` property to the error when `verbose` option is enabled.'
    );
  }).catch(t.fail);

  isGistStarred(1).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '1 is not a string. Expected a Gist ID to check if starred. https://gist.github.com/',
      'should fail when it takes a non-string argument.'
    );
  }).catch(t.fail);

  isGistStarred('').then(t.fail, err => {
    t.strictEqual(
      err.message,
      'Expected a Gist ID to check if starred, but received an empty string.',
      'should fail when it takes an empty string.'
    );
  }).catch(t.fail);

  isGistStarred('1', {verbose: 1}).then(t.fail, err => {
    t.strictEqual(
      err.message,
      '1 is not a Boolean value. `verbose` option must be a Boolean value. (`false` by default)',
      'should fail when `verbose` option is not a Boolena value.'
    );
  }).catch(t.fail);
});

test('isGistStarred() with `GITHUB_TOKEN` environment variable', t => {
  t.plan(1);

  process.env.GITHUB_TOKEN = process.env.IS_GIST_STARRED_TEST_TOKEN;

  isGistStarred('5375574').then(starred => {
    t.strictEqual(
      starred,
      false,
      'use the `GITHUB_TOKEN` environment variable as an access token.'
    );
  }).catch(t.fail);
});
