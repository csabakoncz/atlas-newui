const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

const atlasPubDir=path.resolve(__dirname,'atlas/dashboardv2/public')
const atlasDistJs=path.resolve(__dirname,'atlas/dashboardv2/target/dist/js')
const atlasJsDir=path.resolve(atlasPubDir,'js')
const ourModules=path.resolve(__dirname,'node_modules')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(atlasPubDir,'index.html.tpl'),
      templateParameters: {
        bust: new Date().getTime()
      }
    }),
    new webpack.ProvidePlugin({
      /**
       * There is legacy code that forgets to import a dependency, but uses
       * $, _, Marionette, etc from the global scope.
       */
      jQuery: 'jquery',
      Marionette: 'marionette',
      $: 'jquery',
      Backgrid: 'backgrid',
      _: 'underscore'
    }),
  ],
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            /**
             * A value of false makes troubles with HtmlWebpackPlugin
             */
            transpileOnly: true
          }
        },
        exclude: /node_modules/,
      },
      {
        /**
         * this is now unused, as the legacy code uses hbs: prefix
         * (see resolveLoader below)
         */
        test: /ttemplates\/.*\.html$/,
        use: {
          loader: 'handlebars-loader',
          options: {
            runtime: 'handlebars'
          }
        },
      }
    ],
  },
  resolveLoader: {
    alias: {
      'hbs': 'handlebars-loader?runtime=handlebars',
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html'],
    alias: {
      /**
       * prevent duplicate libraries being loaded from atlas/dashboardv2/target/node_modules
       */
      'backbone': path.resolve(ourModules,'backbone/backbone'),
      'backgrid': path.resolve(ourModules,'backgrid/lib/backgrid'),
      'jquery': path.resolve(ourModules,'jquery/dist/jquery'),
      'underscore': path.resolve(ourModules,'underscore/underscore'),
      /**
       * Use full version of select2
       */
      'select2': path.resolve(ourModules,'select2/dist/js/select2.full'),
      /**
       * These correspond to the old RequireJS path configs:
       */
      App: path.resolve(atlasJsDir, 'App'),
      collection: path.resolve(atlasJsDir, 'collection/'),
      main: path.resolve(atlasJsDir, 'main'),
      models: path.resolve(atlasJsDir, 'models/'),
      modules: path.resolve(atlasJsDir, 'modules/'),
      modules: path.resolve(atlasJsDir, 'modules/'),
      router: path.resolve(atlasJsDir, 'router/'),
      tmpl: path.resolve(atlasJsDir, 'templates/'),
      utils: path.resolve(atlasJsDir, 'utils/'),
      views: path.resolve(atlasJsDir, 'views/'),
      'asBreadcrumbs': 'jquery-asBreadcrumbs',
      'backgrid-orderable': 'backgrid-orderable-columns',
      'backgrid-columnmanager': path.resolve(atlasDistJs, 'external_lib/backgrid-columnmanager/js/Backgrid.ColumnManager'),
      'backgrid-sizeable': 'backgrid-sizeable-columns',
      'bootstrap': 'bootstrap/dist/js/bootstrap.min',
      'dagreD3': 'dagre-d3',
      'daterangepicker': 'bootstrap-daterangepicker',
      'jQuery': 'jquery',
      'jquery-ui': path.resolve(atlasDistJs, 'external_lib/jquery-ui/jquery-ui.min'),
      'jquery-steps': 'jquery-steps/build/jquery.steps.min',
      'query-builder': 'jQuery-QueryBuilder/dist/js/query-builder.standalone.min',
      'sparkline': 'jquery-sparkline',
      'marionette': 'backbone.marionette',
      'pnotify': path.resolve(atlasDistJs, 'external_lib/pnotify/pnotify.custom.min'),
      'pnotify.buttons': path.resolve(atlasDistJs, 'external_lib/pnotify/pnotify.custom.min'),
      'pnotify.confirm': path.resolve(atlasDistJs, 'external_lib/pnotify/pnotify.custom.min'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
};
