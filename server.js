const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
var proxy = require('express-http-proxy');
var url = require('url')
const process = require('process')

const app = express();
const config = require('./webpack.config-dev.js');
const compiler = webpack(config);

var devMode = false
if(process.argv[2]=='--dev'){
  devMode = true
}

console.log(`devMode is ${devMode}`)

if(devMode){
  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}
else{
  app.use(config.output.publicPath, express.static('dist'))
}

const ATLAS_BACKEND=process.env['ATLAS_BACKEND'] || 'localhost:21000'
console.log(`ATLAS_BACKEND is ${ATLAS_BACKEND}`)

app.use('/api', proxy(ATLAS_BACKEND,{
    proxyReqPathResolver: function (req) {
        return '/api'+url.parse(req.url).path
      }
}))


app.use('/css',express.static('atlas/dashboardv2/target/dist/css'))
app.use('/img',express.static('atlas/dashboardv2/target/dist/img'))

app.get('/js/libs/requirejs/require.js',(req,res)=>{
  res.send('console.log("requirejs intercepted")')
});

app.use('/js/external_lib',express.static('atlas/dashboardv2/target/dist/js/external_lib'))
app.use('/js/libs',express.static('atlas/dashboardv2/target/dist/js/libs'))

//login handling
app.use('/login.jsp', express.static('atlas/webapp/src/main/webapp/login.html.template',{
    setHeaders: res => res.set('content-type', 'text/html')
}))
app.use('/js/modules/atlasLogin.js', express.static('atlas/dashboardv2/target/dist/js/modules/atlasLogin.js'))
app.use('/j_spring_security_check', proxy(ATLAS_BACKEND,{
    proxyReqPathResolver: function (req) {
        return '/j_spring_security_check'
    }
}))

const port = 3030
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!\n`);
});