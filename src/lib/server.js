#!/usr/bin/env node

import path from 'path'
import http from 'http'
import https from 'https'
import connect from 'connect'
import httpProxy from 'http-proxy'
import proxyInjector from './proxy-injector'

const app = connect()

const proxy = httpProxy.createProxyServer({
   target: 'https://jquery.com/',
   agent: https.globalAgent,
   headers: { host: 'jquery.com' },
})

const testFile = path.resolve(process.cwd(), './test/test.js')
console.log(testFile)

app.use(proxyInjector(testFile))

app.use((req, res) => {
  proxy.web(req, res)
})

const server = http.createServer(app)

process.on('uncaughtException', (err) => {
  console.log(err)
  server.close()
  process.exit(1)
})

server.listen(8000)
console.log('listening on port 8000')
