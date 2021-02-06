function buildConfig(env) {
  const file = 'prod';

  return require(`./webpack_config/webpack.config.${file}.js`)(env);
}

module.exports = (env) => buildConfig(env);
