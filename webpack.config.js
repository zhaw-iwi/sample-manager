var webpack = require('webpack');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var path = require('path');
var helpers = require('./helpers');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BuildConfigPlugin = require('./build-config');

var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

var metadata = {
  title: helpers.getPkg().name,
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
  ENV: ENV
};
/*
 * Config
 */
module.exports = helpers.validate({
  // static data for index.html
  metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'source-map',
  debug: true,

  // our angular app
  entry: {
    app: './src/boot.ts',
    vendor: './src/vendor.ts'
  },

  // Config for our build files
  output: {
    path: helpers.root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map'
  },

  resolve: {
    alias: {
      materializecss: 'materialize-css/dist/css/materialize.css',
      materialize: 'materialize-css/dist/js/materialize.js'
    },
    extensions: ['', '.ts', '.js', '.scss', '.css']
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint'
      }
    ],
    loaders: [
      // Support for materialize-css
      {
        test: /materialize\.js/,
        loader: 'imports?materializecss'
      },
      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      //Support for *.json files.
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // Allows compiling sass into css
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      /*
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass')
      },*/
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      //
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
        loader: 'file'
      },
      // support for .html as raw text
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      },

      // Support for CSS as raw text (do not match 'materialize')
      {
        test: /^((?!materialize).)*\.css$/,
        loader: 'raw-loader'
      },
      {
        test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=100000'
      }

    ],
    noParse: [path.join(__dirname, 'node_modules', 'angular2', 'bundles')]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new BuildConfigPlugin({
      env: 'dev',
      from: './src/assets/configs/[env].json',
      to: './src/config.json'
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Hammer: "hammerjs/hammer"
    })
  ],

  postcss: [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ],

  // Other module loader config
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },

  // our Webpack Development Server config
  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    watchOptions: {aggregateTimeout: 300, poll: 1000}
  },
  // we need this due to problems with es6-shim
  node: {global: 'window', progress: false, crypto: 'empty', module: false, clearImmediate: false, setImmediate: false}
});
