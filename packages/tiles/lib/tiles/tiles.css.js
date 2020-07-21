const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const env = require('./env');

function styleResolveLoaders({
  postCssPlugins = null,
  useExtract = true,
  useCssModule,
  useSassLoader,
} = {}) {
  const IS_PROD = env.modeIs('prod');
  const sourceMapOptions = !IS_PROD ? { sourceMap: true } : {};
  const cssExtractor = [
    {
      loader: 'cache-loader', // 对抽离css文件前，将css-loader产生的结果缓存到cache-loader
      options: {
        cacheDirectory: env.get('CACHE_DIR'),
      },
    },
    {
      loader: 'css-loader',
      options: {
        esModule: true,
        // ...sourceMapOptions,
        modules: useCssModule
          ? {
              mode: 'local', // css模块默认local
              localIdentName: !IS_PROD ? '[path][name]__[local]' : '[hash:base64:5]', // 开发环境使用原来的名字
            }
          : false,
        importLoaders: postCssPlugins ? 1 : 0, // if use postcss， need importLoaders
      },
    },
  ];
  if (postCssPlugins) {
    // hippy不需要加postcss的前缀
    cssExtractor.push({
      loader: 'postcss-loader',
      options: {
        plugins: postCssPlugins, // browserlist在packagejson中
      },
    });
  }
  if (useSassLoader) {
    cssExtractor.push(
      { loader: 'resolve-url-loader', options: { ...sourceMapOptions } }, // 用来解析sass中@import引用图片资源的位置问题
      {
        loader: 'sass-loader',
        options: {
          ...sourceMapOptions,
        },
      }
    );
    if (useExtract) {
      cssExtractor.unshift({
        loader: ExtractCssChunks.loader,
        options: { hmr: !!env.isWds },
      });
    }
  }
  return cssExtractor;
}

module.exports = ({
  useCssModule = false,
  cssModulePaths, // default will enable .module.css witch css module
  useSass = true,
  postCssPlugins = null,
} = {}) => {
  if (useCssModule) {
    // eslint-disable-next-line no-param-reassign
    cssModulePaths = /\.module\.css$/; // setDefault css module path
  }
  if (env.targetIs('server')) {
    // in server
    return {
      module: {
        rules: [
          { test: /\.css$/, use: 'ignore-loader' },
          { test: /\.s[a|c]ss$/i, use: 'ignore-loader' },
          {
            rules: [
              {
                test: /\.css$/i,
                use: styleResolveLoaders({ useCssModule: true, useExtract: false, postCssPlugins }),
                include: cssModulePaths,
              },
              {
                test: /\.css$/i,
                use: 'ignore-loader',
                exclude: cssModulePaths,
              },
              // 通过include和exclude配合产生相斥的加载cssModule的规则，保证进入到不同的loader中
              useSass && {
                test: /\.(scss|sass)$/,
                use: styleResolveLoaders({
                  useCssModule: true,
                  useSassLoader: true,
                  useExtract: false,
                  postCssPlugins,
                }),
                include: cssModulePaths,
              },
              useSass && {
                test: /\.(scss|sass)$/,
                use: 'ignore-loader',
                exclude: cssModulePaths,
              },
            ].filter((r) => !!r),
          },
        ],
      },
    };
  }
  const IS_PROD = env.modeIs('prod');
  return {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: styleResolveLoaders({ useCssModule: true, postCssPlugins }),
          include: cssModulePaths,
        },
        {
          test: /\.css$/i,
          use: styleResolveLoaders({ useCssModule: false, postCssPlugins }),
          exclude: cssModulePaths,
        },
        // 通过include和exclude配合产生相斥的加载cssModule的规则，保证进入到不同的loader中
        useSass && {
          test: /\.(scss|sass)$/,
          use: styleResolveLoaders({ useCssModule: true, useSassLoader: true, postCssPlugins }),
          include: cssModulePaths,
        },
        useSass && {
          test: /\.(scss|sass)$/,
          use: styleResolveLoaders({ useCssModule: false, useSassLoader: true, postCssPlugins }),
          exclude: cssModulePaths,
        },
      ].filter((r) => !!r),
    },
    plugins: [
      new ExtractCssChunks({
        filename: IS_PROD ? '[name].[contenthash].css' : '[name].css',
      }),
      IS_PROD &&
        new OptimizeCssAssetsPlugin(/* { cssnano的选项，如需sourcemap打开这个
        cssProcessorOptions: {
          map: { inline: false }
        },
      } */),
    ].filter((item) => !!item),
  };
};
