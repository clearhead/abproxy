#!/usr/bin/env node

import Liftoff from 'liftoff'
import cli from 'commander'
import pkg from '../../package.json'
import cp from 'child_process'

cli
  .version(pkg.version)
  .usage('[options]')
  .option('-p, --port <n>', 'The proxy port', Number, 8000)
  .option('-r, --create-rc', `Create .abproxyrc file`, false)
  .option('--variation [type]', 'Specify variation to run [v1]', 'v1')
  .parse(process.argv)

const abproxy = new Liftoff({
  name: 'abproxy',
  configName: '.abproxy',
  extensions: {
    'rc': null
  },
})

abproxy.on('require', (name, module) => {
  console.log('Requiring external module:', name, module)
})

abproxy.on('requireFail', (name, err) => {
  console.log('Unable to require external module:', name, err)
})

abproxy.launch({}, invoke)

function invoke(env) {
  if (cli.createRc) promptForConig()
  else if (env.configPath) spinup(env.configPath, cli.port, cli.variation)
  else console.log('.abproxyrc file not found')
}

function promptForConig() {
  const rcpromptFile = path.resolve(__dirname, '../lib/rcprompt.js')
  const rcprompt = cp.fork(rcpromptFile)

  rcprompt.on('message', (msg) => {
    console.log(msg)
  })
}

function spinup(config, port) {
  console.log(config, port)
}
