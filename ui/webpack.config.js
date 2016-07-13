/*eslint-disable no-var */

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {

  devtool: 'inline-source-map',

  entry: ['/../src/abc-web.js', '/src/abcui-loader.js' ].map(function(e) {
    return __dirname + e;
  }),

  output: {
    path: __dirname + '/bundle/js',
    filename: 'abcui-loader.js'
  },

  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: [ 'es2015', 'react' ] }
      }
    ]
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  }
}
