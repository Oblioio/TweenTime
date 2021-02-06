/* eslint-disable quote-props */
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: 'airbnb-base',
  globals: {
    madea: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'no-plusplus': 'off',
    'no-console': 'off',
    'camelcase': 'off',
    'no-underscore-dangle': 'off',
    'comma-dangle': 'off',
    'no-use-before-define': 'off',
    'max-len': 'off',
    'no-multi-assign': 'off',
    'linebreak-style': 'off'
  }
};
