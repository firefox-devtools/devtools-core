const path = require("path");
const webpack = require("webpack");
const process = require("process");

function makeBundle({ outputPath, projectPath, watch = false }) {
  const webpackConfig = require(path.resolve(projectPath, "webpack.config.js"));

  return new Promise((resolve, reject) => {
    const webpackCompiler = webpack(webpackConfig);
    process.env.TARGET = "firefox-panel";
    process.env.OUTPUT_PATH = outputPath;

    const postRun = (error, stats) => {
      if (stats.hasErrors()) {
        reject();
      }

      resolve();
    };

    if (watch) {
      return webpackCompiler.watch({}, postRun);
    }

    return webpackCompiler.run(postRun);
  });
}

module.exports = makeBundle;

