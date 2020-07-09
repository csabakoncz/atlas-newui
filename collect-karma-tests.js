
//create globals used by production code:
require('./setup-jest')

// https://github.com/webpack-contrib/karma-webpack#alternative-usage
// require all modules ending in "_test" from the
// current directory and all subdirectories
const testsContext = require.context('./src', true, /\.test$/);

testsContext.keys().forEach(testsContext);