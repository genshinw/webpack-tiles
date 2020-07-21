const path = require('path');
const env = require('./env');

module.exports = (opt = {}) => {
  const IS_PROD = env.modeIs('prod'); // every tiles can use this function to get the env mode
  if (opt.path) {
    env.set('OUTPUT_PATH', opt.path);
    env.set('OUTPUT_BASE_PATH', path.dirname(opt.path));
  }
  opt.publicPath && env.set('PUBLIC_PATH', opt.publicPath);
  return {
    output: {
      hashDigestLength: 6, // set file hash length
      path: env.get('OUTPUT_PATH'),
      publicPath: env.get('PUBLIC_PATH'),
      filename: IS_PROD ? '[name].[chunkhash].bud.js' : '[name].bud.js',
      chunkFilename: IS_PROD ? '[name].[chunkhash].chk.js' : '[name].chk.js',
      ...opt,
    },
  };
};
