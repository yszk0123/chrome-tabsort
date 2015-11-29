const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/webapp/index'
  ],
  output: {
    path: path.join(__dirname, '..', 'dist', 'webapp'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', 'src')
    }, {
      test: /\.css$/,
      loaders: ['style', 'css'],
      include: path.join(__dirname, '..', 'src')
    }]
  }
};;
