#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const { tilesMeta } = require('webpack-tiles');
const configMap = require('../lib/util/configMap');
const runCommand = require('../lib/util/runCommand');

console.log('Welcome use webpack-tiles-cli, Do you need these handler(tiles)?\n');
const question = [
  {
    type: 'confirm',
    name: 'babel',
    message: '"babel" 【transform your js(ES6) file】 ',
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
const serverSkipTile = ['assetsManifest', 'devServer'];

inquirer.prompt(question).then((answers) => {
  const dependency = ['webpack-dev-server', 'webpack', 'webpack-cli', 'clean-webpack-plugin'];
  const webpackClientTemplateArg = [];
  const webpackServerTemplateArg = [];
  const tilesIndexTemplateArg = [];
  Object.keys(answers).forEach((tile) => {
    if (answers[tile] && tilesMeta[tile]) {
      // need tile
      dependency.push(tilesMeta[tile].dependency);
      if (configMap[tile]) {
        webpackClientTemplateArg.push(configMap[tile]());
        if (!serverSkipTile.some((t) => t === tile)) {
          webpackServerTemplateArg.push(configMap[tile]());
        }
        tilesIndexTemplateArg.push(tile);
      }
    }
  });
  const webpackClientTemplate = handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, '../util/webpack.client.hbs')).toString()
  );
  const webpackConfigTemplate = handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, '../util/webpack.config.hbs')).toString()
  );
  const tilesIndexTemplate = handlebars.compile(
    fs.readFileSync(path.resolve(__dirname, '../util/tiles.index.hbs')).toString()
  );
  if (!fs.existsSync('./config')) {
    fs.mkdirSync('./config');
  }
  fse.copySync(
    path.resolve(path.dirname(require.resolve('webpack-tiles')), './lib/tiles'),
    path.resolve('./config/tiles')
  );
  fs.writeFileSync(
    path.resolve('./config/tiles/index.js'),
    tilesIndexTemplate({ tiles: tilesIndexTemplateArg })
  );
  fs.writeFileSync(
    path.resolve('./config/webpack.client.js'),
    webpackClientTemplate({ tiles: webpackClientTemplateArg })
  );
  fs.writeFileSync(path.resolve('./webpack.config.js'), webpackConfigTemplate({}));

  const installCommand = `npm i -D ${dependency.toString().replace(/,/g, ' ')}`;
  console.log('install dependency', installCommand);
  // runCommand();
  promptServer(webpackServerTemplateArg);
});
