/* global __dirname */

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const webpack = require('webpack')

module.exports = [
  {
    name: 'client',
    entry: {
      js: './client/'
    },
    output: {
      path: __dirname + '/dist/public/',
      filename: 'client.js'
    },
    target: 'web',
    module: {
      loaders: [
        { test: /\.json$/, loader: 'json' },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel',
          query: {
            plugins: [ 'lodash' ],
            presets: [ 'es2015-native-modules' ]
          } },
        { test: /\.(frag|vect|glsl[vf]?)$/, exclude: /node_modules/, loader: 'raw' },
        { test: /\.(frag|vect|glsl[vf]?)$/, exclude: /node_modules/, loader: 'glslify' }
      ]
    },
    plugins: [
      new LodashModuleReplacementPlugin
    ]
  },
  {
    name: 'server',
    entry: {
      js: './server/'
    },
    output: {
      path: __dirname + '/dist/',
      filename: 'server.js'
    },
    target: 'node',
    module: {
      loaders: [
        { test: /\.json$/, loader: 'json' },
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel',
          query: {
            plugins: [ 'lodash' ],
            presets: [ 'es2015-native-modules' ]
          }
        }
      ]
    },
    plugins: [
      new LodashModuleReplacementPlugin
    ]
  }
]
