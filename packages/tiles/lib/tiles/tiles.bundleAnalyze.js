const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const env = require('./env');

module.exports = (opt = {}) =>
  env.isAnalyze
    ? {
        devtool: false, // can run faster
        plugins: [
          new BundleAnalyzerPlugin({
            port: 8003,
            openAnalyzer: true,
            // analyzerMode: 'static',     // do not use server to analyse
            // excludeAssets: /.*.chk.js/, // can use to exclude lost chunk
            ...opt,
          }),
        ],
      }
    : {};
