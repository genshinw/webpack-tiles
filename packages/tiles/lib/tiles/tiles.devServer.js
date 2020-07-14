const env = require('./env');
module.exports = (opt = {}) =>
  env.isWsd
    ? {
        devtool: 'inline-cheap-module-source-map', // for fast recompile
        devServer: {
          port: 8002,
          hot: true,
          headers: { 'Access-Control-Allow-Origin': '*' },
          stats: 'minimal',
          // contentBase: OUTPUT_LIB_PATH, // 这里是contentBaseUrl(默认为/)的serve路径, 因为vendor打包在这里
          // allowedHosts: ['news.html5.qq.com'],
          // host: 'test.zixun.imtt.qq.com'
          // sockHost: !!WHISTLE_TEST_HOST ? WHISTLE_TEST_HOST : '',
        },
      }
    : {};
