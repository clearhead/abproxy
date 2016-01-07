#!/usr/bin/env node

import inquirer from 'inquirer'
import { resolve } from 'path'
import jsonfile from 'jsonfile'
import pkg from '../../package'

const cwd = process.cwd()
const rcfilename = `.${ pkg.name }rc`

function splitter(input) {
  return input ? input.split(' ') : []
}

const configQuestions = [
  { type: 'input', name: 'url', message: 'What url would you like to proxy?' },
  { type: 'input', name: 'port', message: 'Proxy port?', default: 8000 },
  { type: 'input', name: 'directory', message: 'Directory containing test files?', default: 'build/' },
  { type: 'input', name: 'globalFiles', message: 'Global files?', filter: splitter },
]

function variationsPrompt(done) {
  const variations = []

  function vPrompt(idx = 0) {
    const defaultName = idx === 0 ? 'control' : `v${idx}`
    const nameQ = {
      type: 'input',
      name: 'name',
      message: 'Variation name?',
      default: defaultName,
    }

    const confirm = {
      type: 'confirm',
      name: 'addVariation',
      message: `Would you like to add ${ idx === 0 ? 'a' : 'another' } variation?`,
      default: false,
    }

    inquirer.prompt(confirm, (response) => {
      if (!response.addVariation) return done(variations)

      inquirer.prompt(nameQ, ({ name }) => {
        const filesQ = {
          type: 'input',
          name: 'files',
          message: 'Filepaths to include?',
          default: `${name}.js`,
          filter: splitter,
        }

        inquirer.prompt(filesQ, ({ files }) => {
          variations.push({ name, files })
          vPrompt(idx + 1)
        })
      })
    })
  }

  vPrompt()
}

function writeRc(path, config, done) {
  const filepath = resolve(path, rcfilename)
  jsonfile.writeFile(filepath, config, { spaces: 2 }, done)
}

inquirer.prompt(configQuestions, (answers) => {
  const configPathQ = {
    type: 'input',
    name: 'configPath',
    message: `Path for ${rcfilename} file`,
    default: cwd,
  }

  variationsPrompt((variations) => {
    const config = Object.assign({}, answers, { variations })

    inquirer.prompt(configPathQ, ({ configPath }) => {
      writeRc(configPath, config, (err) => {
        process.send(err || `${rcfilename} created successfully.`)
        process.exit(err ? 1 : 0)
      })
    })
  })
})
