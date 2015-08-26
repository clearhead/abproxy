#!/usr/bin/env node

import program from 'commander';
import rc from 'rc';
import pkg from '../../package.json';
import path from 'path';
import cp from 'child_process';

const rcfile = `.${ pkg.name }rc`;

program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('-p, --port <n>', 'The proxy port', Number, 8000)
  .option('-c, --config', `Path to config file`)
  .option('-r, --create-rc', `Create ${ rcfile } file`, false)
  .parse(process.argv);

if (program.createRc) {
  const rcpromptFile = path.resolve(__dirname, '../lib/rcprompt.js');
  const rcprompt = cp.fork(rcpromptFile);

  rcprompt.on('message', (msg) => {
    console.log(msg);
  });

  rcprompt.on('exit', (code) => {
    const status = (
      code === 0 ? `${ rcfile } created successfully.`
                 : `Unable to create ${ rcfile } file.`
    );

    console.log(status);
  });
}

else {
  console.log(Object.keys(program));
}

export default program;
