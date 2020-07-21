const fs = require('fs');
const inquirer = require('inquirer');
const promptBabel = require('./promptBabel');

async function program() {
  console.log(
    'Welcome use webpack-tiles-cli, By default, it will generate webpack config for "client" target'
  );
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'needServer',
      message: 'Do you also need config for "server" target(nodejs)?',
      default: true,
    },
  ]);
  if (answer.needServer) {
    process.env.SERVER_CONFIG = 'true';
  }
  console.log('\nNow choose your webpack block function');
  // make config dir
  if (!fs.existsSync('./config')) {
    fs.mkdirSync('./config');
  }
  const p1 = await promptBabel();
  console.log(p1);
}
program();
module.exports = program;
