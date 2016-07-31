const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    background: './packages/ts-app/background',
    options: './packages/ts-app/options',
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js',
  },
  resolve: {
    root: [
      path.resolve('./node_modules'),
      path.resolve('./packages'),
    ],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.json', '.react.css'],
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: path.join(__dirname, '..', 'src')
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, '..', 'src'),
        query: {
          cacheDirectory: true
        },
      },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
};
