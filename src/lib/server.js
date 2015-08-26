#!/usr/bin/env node

import http from 'http';
import https from 'https';
import connect from 'connect';
import httpProxy from 'http-proxy';
import proxyInjector from './proxy-injector';

const app = connect();

const proxy = httpProxy.createProxyServer({
   target: 'https://nodejs.org',
   agent: https.globalAgent,
   headers: { host: 'nodejs.org' },
})

app.use(proxyInjector('test/test.js'));

app.use((req, res) => {
  proxy.web(req, res);
});

const server = http.createServer(app);

process.on('uncaughtException', (err) => {
  console.log(err);
  server.close();
  process.exit(1);
});

server.listen(8000);
console.log('listening on port 8000');
