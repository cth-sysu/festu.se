const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

let filename = '[name].dev.js';
let devtool = 'eval-source-map';

if (process.env.NODE_ENV === 'production') {
  filename = '[name].[chunkhash].js';
  devtool = 'source-map';
}

const config = {
  devtool,
  context: path.join(__dirname, 'src'),
  entry: {
    index: './main.js',
  },
  output: {
    filename: `js/${filename}`,
    path: path.join(__dirname, 'static', 'public'),
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: ['env'],
      },
    }]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    }),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'static', 'public'),
    proxy: {'/api': 'http://localhost:5000'},
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.unshift(new webpack.HashedModuleIdsPlugin());
}

module.exports = config;
