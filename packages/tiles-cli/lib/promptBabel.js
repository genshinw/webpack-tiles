const inquirer = require('inquirer');
const { tilesMeta } = require('webpack-tiles');
const generateFileFromTemplate = require('./util/generateFileFromTemplate');

async function promptBabel() {
  const devDependency = [];
  const dependency = [];
  const r1 = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'babel',
      message: '"babel" 【transform your js(ES6) file】',
      default: true,
    },
  ]);
  if (r1.babel) {
    const tileMeta = tilesMeta.babel;
    devDependency.push(...tileMeta.dependency);
    const r2 = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Which framework do you use?',
        choices: ['react', 'none'],
        default: 'none',
      },
    ]);
    console.log('r2', r2);
    let isInReact = false;
    if (r2.framework === 'react') {
      devDependency.push('@babel/preset-react');
      dependency.push('react-hot-loader'); // react-hot-loader must in dependence
      isInReact = true;
    }
    // write babel file
    generateFileFromTemplate({
      templateName: 'babel.config.hbs',
      templateOpt: {
        presets: JSON.stringify(isInReact ? ['@babel/preset-react'] : []),
        plugins: JSON.stringify(isInReact ? ['react-hot-loader/babel'] : []),
        isNeedServer: !!process.env.SERVER_CONFIG,
      },
      outputPath: './config/babel.config.js',
    });
    // TODO change package.json
  }
  return {
    dependency,
    devDependency,
    belongTarget: ['client', 'server'],
    tileServer: `// handle js|jsx with babel, you can modify your browserlist'client in package.json
    tiles.babel({envName: 'server'})`,
    tile: `// handle js|jsx with babel, you can modify your browserlist'server in package.json
    tiles.babel()`,
  };
}
module.exports = promptBabel;
