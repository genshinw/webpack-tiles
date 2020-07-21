const inquirer = require('inquirer');
const { tilesMeta } = require('webpack-tiles');

async function promptOthers() {
  const devDependency = [];
  const dependency = [];
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'assetsManifest',
      message: '"assetsManifest" 【entry: {js: [res], css: [res]}】',
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
  ]);
  Object.keys(answers).forEach((tile) => {
    if (answers[tile] && tilesMeta[tile]) {
      devDependency.push(...tilesMeta[tile].dependency);
    }
  });
  return {
    devDependency,
    dependency,
  };
}

module.exports = promptOthers;
