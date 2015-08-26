#!/usr/bin/env node

import inquirer from 'inquirer';
import path from 'path';
import jsonfile from 'jsonfile';
import pkg from '../../package.json';

const rcfilename = `.${ pkg.name }rc`;
const rcfile = path.resolve(process.cwd(), rcfilename);

function variationFilter(input) {
  return input ? input.split(' ') : [];
}

const configQuestions = [
  { type: 'input', name: 'url', message: 'What url would you like to proxy?' },
  { type: 'input', name: 'port', message: 'Proxy port?', default: 8000 },
  { type: 'input', name: 'directory', message: 'Directory containing test files?', default: 'build/' },
  { type: 'input', name: 'global', message: 'Global files?', filter: variationFilter },
];

function addVariations(done) {
  const variations = [];
  const questions = [
    { type: 'input', name: 'variationName', message: 'Variation name?', default: 'control' },
    { type: 'input', name: 'variationFiles', message: 'Filepaths to include?', filter: variationFilter },
  ];

  function add(initial = false) {
    const confirm = {
      type: 'confirm',
      name: 'addVariation',
      message: `Would you like to add ${ initial ? 'a' : 'another' } variation?`,
      default: false,
    };

    inquirer.prompt(confirm, (response) => {
      if (response.addVariation) {
        inquirer.prompt(questions, (answers) => {
          variations.push(answers);
          add();
        });
      }
      else done(variations);
    });
  }

  add(true);
};

function writeRc(config, done) {
  jsonfile.writeFile(rcfile, config, { spaces: 2 }, done);
};

inquirer.prompt(configQuestions, (answers) => {

  addVariations((variations) => {
    const config = Object.assign({}, answers, { variations });

    writeRc(config, (err) => {
      process.send(err || `${ rcfilename } created successfully.`);
      process.exit(err ? 1 : 0);
    });
  });
})
