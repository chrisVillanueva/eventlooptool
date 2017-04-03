const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './loupe.jsx'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'loupe.bundle.js'
  },
  module: {
    devtool: "source-map",
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['react','babel'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.jpg?$|\.gif?$/,
        loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader",
                  "css-loader?sourceMap",
                  "sass-loader?sourceMap"]
      }
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?sourceMap']
        })
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.jpg?$|\.gif?$/,
        use: 'file-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader?sourceMap', 'sass-loader?sourceMap']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  resolve: {
    extensions: [".jsx", ".json", ".js"]
  },
  context: resolve(__dirname, 'app'),
  devtool: 'inline-source-map',
  devServer: {
    // enale HMR on the server
    //contentBase: resolve(__dirname, 'app'),
    // match the output path
    //publicPath: '/',
    // match the output `publicPath`
    inline: true,
    hot: true,
    stats: false,
    historyApiFallback: true
  }
};
