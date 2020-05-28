const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

const atlasJsDir=path.resolve(__dirname,'atlas/dashboardv2/public/js')
const atlasDistJs=path.resolve(__dirname,'atlas/dashboardv2/target/dist/js')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
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
  externals:{
    /**
     * Dependency for select2, which must be included in a script tag.
     */
    jquery: 'jQuery',
    select2: {
      /**
       * This library is AMD only https://github.com/select2/select2/issues/5631
       */
      amd: 'select2'
    }
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
