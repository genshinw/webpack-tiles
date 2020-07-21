const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

module.exports = function generateFileFromTemplate({ templateName, templateOpt, outputPath } = {}) {
  fs.writeFileSync(
    path.resolve(outputPath),
    handlebars.compile(
      fs.readFileSync(require.resolve(`../util/template/${templateName}`)).toString()
    )(templateOpt)
  );
};
