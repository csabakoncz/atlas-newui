const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
var proxy = require('http-proxy-middleware');
const process = require('process')
const wc = require('./webpack.config-dev.js');

const app = express();

var devMode = false
if(process.argv[2]=='--dev'){
  devMode = true
}

console.log(`devMode is ${devMode}`)

if(devMode){
  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  const compiler = webpack(wc);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: wc.output.publicPath,
  }));
}
else{
  app.use(wc.output.publicPath, express.static('dist'))
}

//proxy config:
for (const [key, target] of Object.entries(wc.devServer.proxy)) {
  console.log(`proxy setup ${key}-> ${target}`);
  app.use(key, proxy({target: target}))
}

// perform extra app config
wc.devServer.before(app)

const port = 3030
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!\n`);
});