const environment = process.env.SITE_ENV || 'local';
const PROD_ENV = 'prod';

const devUrl = 'https://dni94ojnpdnzn.cloudfront.net';
const prodUrl = 'https://www.jinglejangle.com/';
const testUrl = 'https://test.jinglejangle.com/';

const localUrl = 'https://localhost:3000';
const testGoogleID = 'UA-XXXXXXXXX-XX(test)';
const prodGoogleID = 'G-9CS7JDH0JS';
//
let site_url;
let google_id;

const site_path = '/';

const isProd = environment === PROD_ENV;

switch (environment) {
  case 'test':
    site_url = testUrl;
    google_id = testGoogleID;
    break;
  case 'prod':
    site_url = prodUrl;
    google_id = prodGoogleID;
    break;
  case 'dev':
    site_url = devUrl;
    break;
  default:
    site_url = localUrl;
}

module.exports = {
  environment,
  isProd,
  site_url,
  site_path,
  google_id
};
