#!/usr/bin/env node

import { dirname, resolve } from 'path'
import http from 'http'
import https from 'https'
import connect from 'connect'
import httpProxy from 'http-proxy'
import proxyInjector from './proxy-injector'
import url from 'url'
import fs from 'fs'

const argv = require('minimist')(process.argv.slice(2))
const config = JSON.parse(fs.readFileSync(argv.configPath, 'utf8'))
const { href, host, protocol } = url.parse(config.url)
const agent = /s/.test(protocol) ? https : http
const variation = config.variations.filter(v => v.name === argv.variation)[0] || config.variations[0]

if (!variation) {
  console.log('no variations found in config file')
  process.exit(1)
} else {
  console.log(`running variation: ${variation.name}`)
}

const includesDir = resolve(dirname(argv.configPath), config.directory)
const fileIncludes = config.globalFiles.concat(variation.files).map((f) => {
  return resolve(includesDir, f)
})

const app = connect()

const proxy = httpProxy.createProxyServer({
   target: href,
   agent: agent.globalAgent,
   headers: { host },
})

app.use(proxyInjector(fileIncludes))

app.use((req, res) => {
  proxy.web(req, res)
})

const server = http.createServer(app)

process.on('uncaughtException', (err) => {
  console.log(err)
  server.close()
  process.exit(1)
})

server.listen(config.port)
console.log(`listening on port ${config.port}`)
