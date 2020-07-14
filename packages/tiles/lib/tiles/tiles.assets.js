const _ = require('lodash');
const xml2js = require('xml2js');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const env = require('./env');

const MAX_AGE = 2592000;
const builder = new xml2js.Builder();

module.exports = ({
  mergeManifestPath = '',
  fileName = 'client-manifest.json',
  isGenerateXML = false,
} = {}) => {
  const generate = (seed, files, entrypoints) => {
    const manifest = _.mapValues(entrypoints, (value) => ({
      js:
        value
          .filter((file) => file.endsWith('.js'))
          .map((file) => `${env.get('PUBLIC_PATH')}${file}?max_age=${MAX_AGE}`)[0] || '',
      css:
        value
          .filter((file) => file.endsWith('.css'))
          .map((file) => `${env.get('PUBLIC_PATH')}${file}?max_age=${MAX_AGE}`)[0] || '',
    }));
    const mergeJSON = mergeManifestPath ? require(mergeManifestPath) : {};
    return Object.assign(manifest, mergeJSON);
  };
  return {
    plugins: [
      new WebpackManifestPlugin({
        fileName,
        writeToFileEmit: env.test('isWsd'), // WDS环境，文件都在内存中，这个是强制输出
        generate,
        serialize: isGenerateXML
          ? (manifest) =>
              builder.buildObject({
                config: manifest,
              })
          : null, // 默认会JSON.toString
      }),
    ].filter((p) => !!p),
  };
};
