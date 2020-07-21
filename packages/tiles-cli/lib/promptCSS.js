const inquirer = require('inquirer');
const { tilesMeta } = require('webpack-tiles');

async function promptCSS() {
  const devDependency = [];
  const dependency = [];
  const options = {};

  const r1 = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'css',
      message: '"css" 【handle and extract css】',
      default: true,
    },
  ]);
  if (r1.css) {
    const cssDep = tilesMeta.css;
    devDependency.push(cssDep.dependency);
    const r2 = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'sass',
        message: 'is use sass',
        default: true,
      },
      {
        type: 'confirm',
        name: 'module',
        message: 'is use CSS module【default enable in .module.css file】',
        default: false,
      },
      {
        type: 'confirm',
        name: 'postcss',
        message: 'is use postcss【add autoprefixer and so on】',
        default: false,
      },
    ]);
    if (r2.module) {
      options.useCssModule = true;
    }
    if (r2.postcss) {
      devDependency.push(...cssDep.postcssDependency);
      options.postCssPlugins = [];
    }
    if (r2.sass) {
      devDependency.push(...cssDep.sassDependency);
      options.useSassLoader = [];
    }
  }
  return {
    dependency,
    devDependency,
    options,
  };
}
module.exports = promptCSS;
