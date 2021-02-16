// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    app: '/',
    _site: '/'
  },
  plugins: [
    ['snowpack-plugin-raw', {
      extensions: ['.tpl.html'], // Add file extensions saying what files should be loaded as strings in your snowpack application. Default: '.txt'
    }],
    ['@snowpack/plugin-run-script', { cmd: 'eleventy', watch: '$1 --watch' }],
    ['@snowpack/plugin-sass']
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    htmlFragments: true
  },
};
