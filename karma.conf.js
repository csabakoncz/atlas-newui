const path = require('path')
const wc = require('./webpack.config-dev')
const reporters = ['progress', 'spec']

if(process.env.USE_PUPPETEER=='true'){
  process.env.CHROME_BIN = require('puppeteer').executablePath()
}

if(process.env.COVERAGE=='true'){
  reporters.push('coverage-istanbul')

  /**
https://github.com/mattlewis92/karma-coverage-istanbul-reporter/blob/master/test/karma.conf.js
   */
  wc.module.rules.push({
            enforce: 'post',
            test: /\.[tj]s$/,
            exclude: /(node_modules|\.test)/,
            loader: 'coverage-istanbul-loader',
            include: path.resolve(__dirname, 'src'),
            options: {
              esModules: true,
            },
  })
}

module.exports = function(config) {

  config.set({

    files: [
      './collect-karma-tests.js',
      // each file acts as entry point for the webpack configuration
    ],

    // frameworks to use
    frameworks: ['jasmine'],

    preprocessors: {
      // only specify one entry point
      // and require all tests in there
      './collect-karma-tests.js': ['webpack'],
    },

    reporters: reporters,

    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib
      reports: ['html', 'lcovonly', 'text-summary'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, 'coverage-karma'),

      // Combines coverage information from multiple browsers into one report rather than outputting a report
      // for each browser.
      combineBrowserReports: true,

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // Omit files with no statements, no functions and no branches covered from the report
      skipFilesWithNoCoverage: true,

      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/html/index.js#L257-L261
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html'
        }
      },
      verbose: true // output config used by istanbul for debugging
    },

    webpack: {
      ...wc
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      noInfo: true
    },

    plugins: [
      require("karma-jasmine"),
      require("karma-webpack"),
      require("karma-chrome-launcher"),
      require("karma-coverage-istanbul-reporter"),
      require("coverage-istanbul-loader"),
      require("karma-spec-reporter")
    ],

    browsers: ['Chrome']
  });
};