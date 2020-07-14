const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const env = require('./env');

module.exports = ({ cssModulePaths = [], useSass = true, postCssPlugins = null } = {}) => {
  if (env.targetIs('server')) {
    // in server
    return {
      module: {
        rules: [
          { test: /\.css$/, use: 'ignore-loader' },
          { test: /\.s[a|c]ss$/i, use: 'ignore-loader' },
        ],
      },
    };
  }
  const IS_PROD = env.modeIs('prod');
  const sourceMapOptions = !IS_PROD ? { sourceMap: true } : {};
  const styleResolveLoaders = ({ useCssModule, useSassLoader }) => {
    const cssExtractor = [
      {
        loader: ExtractCssChunks.loader,
        options: { hmr: !!env.isWsd },
      },
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
                localIdentName: env.modeIs('dev') ? '[path][name]__[local]' : '[hash:base64:5]', // 开发环境使用原来的名字
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
    }
    return cssExtractor;
  };
  return {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: styleResolveLoaders({ useCssModule: true }),
          include: cssModulePaths,
        },
        {
          test: /\.css$/i,
          use: styleResolveLoaders({ useCssModule: false }),
          exclude: cssModulePaths,
        },
        // 通过include和exclude配合产生相斥的加载cssModule的规则，保证进入到不同的loader中
        {
          test: /\.(scss|sass)$/,
          use: styleResolveLoaders({ useCssModule: true, useSassLoader: true }),
          include: cssModulePaths,
        },
        {
          test: /\.(scss|sass)$/,
          use: styleResolveLoaders({ useCssModule: false, useSassLoader: true }),
          exclude: cssModulePaths,
        },
      ],
    },
    plugins: [
      new ExtractCssChunks({
        filename: IS_PROD ? '[name].[contenthash].css' : '[name].css',
      }),
      IS_PROD &&
        new OptimizeCssAssetsPlugin(/*{ cssnano的选项，如需sourcemap打开这个
        cssProcessorOptions: {
          map: { inline: false }
        },
      }*/),
    ].filter((item) => !!item),
  };
};
