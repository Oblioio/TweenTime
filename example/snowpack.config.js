// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    app: '/',
    _site: '/',
    '../Editor': '/Editor'
  },
  plugins: [
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
