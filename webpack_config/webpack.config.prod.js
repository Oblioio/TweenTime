/* eslint-disable linebreak-style */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const appDir = path.resolve(__dirname, '..', 'app');
const distDir = path.resolve(__dirname, '..', '_site');

const entry = {
  mainjs: './js/main.js',
  core: './js/tweentime/Core.js',
  editor: './js/tweentime/Editor.js',
  styles: './scss/main.scss',
  critical: './scss/critical.scss',
  tweentime: './scss/tweentime/editor.sass'
};

const plugins = [
  // new webpack.NamedModulesPlugin(),

  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),

  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),

  // Put all css code in this file
  // new ExtractTextPlugin('css/main.css'),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: 'css/[name].css',
    chunkFilename: 'css/[id].css',
  }),

  new CopyWebpackPlugin({
    patterns: [
      { from: 'assets', to: 'assets' }
    ]
  }),

  new CopyWebpackPlugin({
    patterns: [
      { from: 'js/tweentime/draggable-number.js/dist/draggable-number.min.js', to: 'js/draggable-number.js' }
    ]
  }),

  new CopyWebpackPlugin({
    patterns: [
      { from: 'scss/tweentime/fonts', to: 'css/fonts' }
    ]
  })
];

module.exports = (env) => {
  // console.log('IS THIS PRODUCTION', env.production);

  const options = {
    mode: 'production',

    context: appDir,

    devtool: 'source-map',

    entry,

    output: {
      filename: 'js/[name].js',
      path: distDir,
      publicPath: '/',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          // include: [
          //   appDir,
          // ],
          // exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                sourceMap: !env.production,
                presets: ['@babel/preset-env'],
                // plugins: [require('@babel/plugin-transform-classes')],
                // compact: env.production,
                cacheDirectory: true,
                babelrc: false,
              },
            },
          ],
        },
        {
          test: /\.s?[ac]ss$/i,
          include: [
            appDir,
          ],
          use: (() => {
            const cssPlugins = env.production ? [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              {
                loader: 'css-loader'
              },
              // {
              //   loader: 'postcss-loader',
              //   options: {
              //     postcssOptions: {
              //       plugins: [require('autoprefixer')({
              //         grid: 'no-autoplace'
              //       })],
              //     }
              //   },
              // },
              {
                loader: 'sass-loader',
              }
            ] : [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'sass-loader',
              }
            ];
            return cssPlugins;
          })(),
        },
        {
          test: /\.tpl.html$/,
          use: [
            {
              loader: 'mustache-loader',
              options: {
                tiny: true,
                noShortcut: true,
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|eot|ttf)(\?[a-z0-9]+)?$/,
          include: [
            appDir,
          ],
          use: 'file-loader?name=assets/fonts/[path][name].[ext]',
        },
        {
          test: /\.(mp3|ogg)$/,
          include: [
            appDir,
          ],
          use: 'file-loader?name=sounds/[name].[ext]',
        },
        {
          test: /\.(jpg|jpeg|png|gif|ico|webp|svg)$/,
          include: [
            appDir,
          ],
          use: [
            {
              loader: 'file-loader?name=assets/images/[path][name].[ext]&context=app/assets/images',
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.scss', '.css'],
      modules: [appDir, 'node_modules'],
    },

    optimization: {
      minimize: env.production,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: process.env.MICROSITES_ENV === 'prod'
            },
          },
        }),
      ],
    },

    plugins,
  };

  if (env.development) {
    options.devServer = {
      contentBase: distDir,
      watchContentBase: true,
      port: 3000,
      https: true,
    };
  }

  return options;
};
