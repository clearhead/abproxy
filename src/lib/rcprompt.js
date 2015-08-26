#!/usr/bin/env node

import promzard from 'promzard';
import path from 'path';
import jsonfile from 'jsonfile';
import pkg from '../../package.json';

const rcfile = `.${ pkg.name }rc`;

const rcpromptInput = path.resolve(__dirname, './rcprompt-input.js');

promzard(rcpromptInput, (err, config) => {
  if (err) {
    process.send(err);
    process.exit(1);
  }

  const out = path.resolve(process.cwd(), rcfile);
  jsonfile.writeFile(out, config, { spaces: 2 }, (err) => {
    if (err) process.send(err);
    process.exit(err ? 1 : 0);
  });
});
