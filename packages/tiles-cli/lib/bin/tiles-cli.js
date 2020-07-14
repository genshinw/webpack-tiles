#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const { tilesMeta } = require('webpack-tiles/');
const configMap = require('../util/configMap');
const runCommand = require('../util/runCommand');

console.log('Welcome use webpack-tiles-cli, Do you need these handler(tiles)? ');
const question = [
  {
    type: 'confirm',
    name: 'babel',
    message: '"babel" 【transform you js(ES6) file】 ',
    default: true,
  },
  {
    type: 'confirm',
    name: 'assetsManifest',
    message: '"assetsManifest" 【entry: {js: [res], css: [res]}】',
    default: true,
  },
  {
    type: 'confirm',
    name: 'css',
    message: '"css" 【extract css】',
    default: true,
  },
  {
    type: 'confirm',
    name: 'additionalRes',
    message: '"additionalRes" 【svg|png handle】',
    default: false,
  },
  {
    type: 'confirm',
    name: 'devServer',
    message: '"devServer" 【for debug】',
    default: true,
  },
];
let template = null;
fs.readFile(path.resolve(__dirname, './util/config.hbs'), (err, data) => {
  if (err) {
    console.log('err', err);
  }
  template = handlebars.compile(data.toString());
});
inquirer.prompt(question).then((answers) => {
  const dependency = [];
  const jsTemplate = [];
  Object.keys(answers).forEach((tile) => {
    if (answers[tile] && tilesMeta[tile]) {
      // need tile
      dependency.push(tilesMeta[tile].dependency);
      if (configMap[tile]) {
        jsTemplate.push(configMap[tile]());
      }
    }
  });
  const files = template({ tiles: jsTemplate });
  if (!fs.existsSync('./config')) {
    fs.mkdirSync('./config');
  }
  fs.copyFileSync(
    path.resolve(path.dirname(require.resolve('webpack-tiles')), './lib/tiles/babel.config.js'),
    path.resolve('./config/babel.config.js')
  );
  fs.writeFileSync(path.resolve('./config/webpack.config.js'), files);
  runCommand(`npm i -D ${dependency.toString().replace(/,/g, ' ')}`);
});
