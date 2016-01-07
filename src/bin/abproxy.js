#!/usr/bin/env node

import Liftoff from 'liftoff'
import cli from 'commander'
import pkg from '../../package'
import { resolve } from 'path'
import { fork } from 'child_process'

cli
  .version(pkg.version)
  .usage('[options]')
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
  if (cli.createRc) promptForConfig()
  else if (env.configPath) spinupProxy(env.configPath, cli.variation)
  else console.log('.abproxyrc file not found')
}

function promptForConfig() {
  const rcpromptFile = resolve(__dirname, '../lib/rcprompt.js')
  const rcprompt = fork(rcpromptFile)

  rcprompt.on('message', (msg) => {
    console.log(msg)
  })
}

function spinupProxy(configPath, variation) {
  console.log(configPath, variation)
}
