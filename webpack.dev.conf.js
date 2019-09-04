const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config');

module.exports = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  devtool: 'inline-source-map',
});

