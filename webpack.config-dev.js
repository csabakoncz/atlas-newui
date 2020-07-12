const process = require('process')
const express = require('express');
const wc = require('./webpack.config')
module.exports = wc

const ATLAS_BACKEND = process.env['ATLAS_BACKEND'] || 'http://localhost:21000'
console.log(`ATLAS_BACKEND is ${ATLAS_BACKEND}`)

const staticContent = {
    '/css': 'atlas/dashboardv2/target/dist/css',
    '/img': 'atlas/dashboardv2/target/dist/img',
    '/js/external_lib': 'atlas/dashboardv2/target/dist/js/external_lib',
    '/js/libs': 'atlas/dashboardv2/target/dist/js/libs',
    '/js/modules/atlasLogin.js': 'atlas/dashboardv2/target/dist/js/modules/atlasLogin.js',
}

wc.mode = 'development'
wc.devtool = 'inline-source-map'
wc.devServer = {
    contentBase: '.',
    proxy: {
        '/api': ATLAS_BACKEND,
        '/j_spring_security_check': ATLAS_BACKEND,
        '/logout.html': ATLAS_BACKEND
    },
    before: function (app, server, compiler) {

        app.get('/js/libs/requirejs/require.js', (req, res) => {
            res.send('console.log("requirejs intercepted")')
        });

        app.use('/login.jsp', express.static('atlas/webapp/src/main/webapp/login.html.template', {
            setHeaders: res => res.set('content-type', 'text/html')
        }))

        for (const [key, path] of Object.entries(staticContent)) {
            console.log(`express static content ${key}-> ${path}`);
            app.use(key, express.static(path))
        }
    }
}


