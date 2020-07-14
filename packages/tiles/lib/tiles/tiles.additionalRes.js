// 除去JS CSS外的其他资源
module.exports = () => {
  return {
    module: {
      rules: [
        {
          test: /\.(ico|gif|png|jpg|jpeg|svg|webp)$/, // 对这些第三方资源采取url-loader
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8000, // 目前限制8k,有很多大文件要注意下, 大于该limit的也会用file-loader
                name: '[path][name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|wav|woff|mp3)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash:6].[ext]',
              },
            },
          ],
        },
      ],
    },
  };
};
