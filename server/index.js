import http from 'http'

import Koa from 'koa'
import serve from 'koa-static'

import opn from 'opn'

const argv = require('minimist')(process.argv.slice(2))

const PUBLIC = './dist/public/'

const ADDRESS = argv['address'] || '0.0.0.0'
const HTTP = argv['port'] || 8080

const app = new Koa()

app.use(serve(PUBLIC))

http.createServer(app.callback()).listen(HTTP, ADDRESS, () => {
  const uri = `http://${ADDRESS}:${HTTP}`
  console.log('Server started at', uri)
  if (argv['open']) opn(uri)
})
