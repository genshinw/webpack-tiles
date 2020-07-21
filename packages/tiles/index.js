/**
 * Every tiles must use with 'webpack-merge'
 * to get webpack's env in webpack
 */
const path = require('path');
const merge = require('webpack-merge');
const checkPkg = require('./lib/utils/checkPkg');
const env = require('./lib/tiles/env');

const tiles = {};
const tilesMeta = {
  output: {
    path: 'tiles.output',
    dependency: [],
  },
  css: {
    path: 'tiles.css',
    dependency: [
      'cache-loader',
      'css-loader',
      'ignore-loader',
      'extract-css-chunks-webpack-plugin',
      'optimize-css-assets-webpack-plugin',
    ],
    sassDependency: [
      'node-sass',
      'sass-loader',
      'resolve-url-loader', // handle @import sass url
    ],
    postcssDependency: ['postcss-loader'],
  },
  additionalRes: {
    path: '.tiles.additionalRes',
    dependency: ['url-loader', 'file-loader'],
  },
  babel: {
    path: './tiles/tiles.babel',
    dependency: [
      'cache-loader',
      'babel-loader',
      'thread-loader',
      '@babel/core',
      '@babel/preset-env',
    ],
  },
  assetsManifest: {
    path: 'tiles.assetsManifest',
    dependency: ['webpack-manifest-plugin', 'xml2js'],
  },
  devServer: {
    path: 'tiles.devServer',
    dependency: ['webpack-dev-server'],
  },
  bundleAnalyze: {
    path: 'tiles.bundleAnalyze',
    dependency: ['webpack-bundle-analyzer'],
  },
};
(function _setTiles(tileMetas) {
  const dep = [];
  Object.keys(tileMetas).forEach((tileKey) => {
    const tile = tilesMeta[tileKey];
    dep.push(...tile.dependency);

    Object.defineProperty(tiles, tileKey, {
      get: () => {
        if (tile.dependency) {
          checkPkg(tile.dependency);
        }
        // eslint-disable-next-line import/no-dynamic-require,global-require
        return require(path.join('./lib/tiles', tile.path));
      },
    });
  });
})(tilesMeta);
module.exports = {
  tilesMeta,
  tiles,
  merge,
  env,
};
