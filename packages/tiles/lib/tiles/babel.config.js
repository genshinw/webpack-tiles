function getPresets(isServer) {
  const presets = []; // TODO add your preset by your self
  if (!isServer) {
    presets.unshift([
      '@babel/preset-env',
      {
        browserslistEnv: 'web', // 读取设置在packageJson中的browserlist配置，里面('Last 4 versions', 'iOS 7')沿用之前的preset，其实转换量挺大的
        modules: false, // 交由webpack处理esm模块
      },
    ]);
    return presets;
  }
  presets.unshift([
    '@babel/preset-env',
    {
      browserslistEnv: 'node', // 读取设置在packageJson中的browserlist配置
      modules: 'cjs', // 转换服务器端代码时，先转为commonjs语法，这样import()这种就不会拆包了
    },
  ]);
  return presets;
}

function getPlugins(isServer) {
  const plugins = []; // TODO add you plugin by your self
  if (!isServer) {
    plugins.push([
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false, // corejs generator的非global polyfill不需要，在webpack的dll进行了需要的polyfill
        regenerator: false,
        useESModules: true, // 利于treeshake, 需要保证babel转换的cjs模块（eg. @tencent/news-ug-component）不能再进行babel解析，否则cjs混合esm的头部，exports会undefined
        helpers: true, // 对babel转换函数helper进行聚合，例如_classCheck (大概可以节省1M左右gzip前)
      },
    ]);
  }
  return plugins;
}

module.exports = (api) => {
  // 这里不能通过config的IS_SERVER进行判断，（thread-loader开启多进程的时候没有把process.env带过去）
  const isInServer = api.caller((caller) => {
    return !!(caller && caller.target === 'node'); // 基于webpack的target选项
  });
  return {
    presets: getPresets(isInServer),
    plugins: getPlugins(isInServer),
  };
};
