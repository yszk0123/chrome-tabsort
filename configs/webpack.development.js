const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    background: './src/boot/background',
    options: './src/boot/options'
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css'],
      include: path.join(__dirname, '..', 'src')
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, '..', 'src'),
      query: {
        cacheDirectory: true
      }
    }]
  }
};
