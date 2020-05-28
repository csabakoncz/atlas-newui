const wc = require('./webpack.config')

wc.mode='development'
wc.devtool='inline-source-map'

module.exports = wc

