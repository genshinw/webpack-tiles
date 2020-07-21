const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const handlebars = require('handlebars');

const serverSkipTile = ['assetsManifest', 'devServer'];
export default function promptServer(tiles) {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'needServer',
        message: 'Do you also want to webpack config for server(nodeJS) ?',
        default: true,
      },
    ])
    .then((answers) => {
      if (answers.needServer) {
        const installCommand = `npm i -D webpack-node-external wait-on concurrently nodemon`;
        const webpackServerTemplate = handlebars.compile(
          fs.readFileSync(path.resolve(__dirname, '../util/webpack.server.hbs')).toString()
        );
        fs.writeFileSync(
          path.resolve('./config/webpack.server.js'),
          webpackServerTemplate({ tiles })
        );
        console.log('install dependency', installCommand);
      }
    });
}
