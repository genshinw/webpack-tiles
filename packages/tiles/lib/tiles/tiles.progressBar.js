const webpack = require('webpack');
const CliProgress = require('cli-progress');

module.exports = () => {
  const loadingBar = new CliProgress.SingleBar(
    {
      format: 'Compiling...{bar} | {percentage}%',
      stopOnComplete: true,
      clearOnComplete: true,
    },
    CliProgress.Presets.shades_grey
  );
  return {
    plugins: [
      new webpack.ProgressPlugin((percentage) => {
        if (percentage <= 0) {
          loadingBar.start(100, percentage);
        } else {
          loadingBar.update(percentage * 100);
        }
      }),
    ],
  };
};
