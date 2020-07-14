module.exports = {
  babel: () =>
    `// handle js|jsx with babel, you can modify your browserlist in package.json
    tiles.babel()`,
  assetsManifest: () =>
    `// generate output assets manifest
    tiles.assetsManifest({
      fileName: 'client-manifest.json',
    })`,
  css: ({ useSass = false } = {}) =>
    `// handle css
    tiles.css({
      useSass: ${useSass},
      // postCssPlugins: [require('autoprefixer')({ remove: false })], // can add postCss plugin as you like
      // cssModulePaths: [] // enable css path 
    })`,
  additionalRes: () =>
    `// handle png|svg and other resource
    tiles.additionalRes()`,
  bundleAnalyze: () =>
    `// in analyze mode,
    tiles.bundleAnalyze()`,
  devServer: () =>
    `// env. use webpack-dev-server,
    tiles.devServer()`,
};
