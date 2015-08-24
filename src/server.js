#!/usr/bin/env node

import http from 'http';
import https from 'https';
import connect from 'connect';
import httpProxy from 'http-proxy';
import proxyInjector from './lib/proxy-injector';

const app = connect();

const proxy = httpProxy.createProxyServer({
   target: 'https://nodejs.org',
   agent: https.globalAgent,
   headers: { host: 'nodejs.org' },
})

app.use(proxyInjector('test/test.js'));

app.use((req, res) => {
  proxy.web(req, res);
);

http.createServer(app).listen(8000);
