/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const process = require("process");
const md5 = require("md5");

function saveStats(stats, projectPath) {
  const statsJson = JSON.stringify(stats.toJson(), null, 2);
  const sha = md5(statsJson).substr(0, 5);

  const dir = path.join(projectPath, `webpack-stats`);
  const statsFile = path.join(dir, `stats-${sha}.json`);

  if (!fs.existsSync(dir)) {
    console.log("creating webpack-stats dir");
    fs.mkdirSync(dir);
  } else {
    console.log("all good");
  }

  fs.writeFileSync(statsFile, statsJson);
  console.log(`Done bundling, stats saved to webpack-stats/stats-${sha}.json`);
}

function makeBundle({
  outputPath,
  projectPath,
  watch = false,
  updateAssets = false,
  onFinish = () => {}
}) {
  process.env.TARGET = "firefox-panel";
  process.env.OUTPUT_PATH = outputPath;

  const webpackConfig = require(path.resolve(projectPath, "webpack.config.js"));
  if (!updateAssets) {
    delete webpackConfig.recordsPath;
  }

  return new Promise((resolve, reject) => {
    const webpackCompiler = webpack(webpackConfig);

    const postRun = (error, stats) => {
      if (stats.hasErrors()) {
        reject(stats.toJson("verbose"));
      }

      if (false) {
        saveStats(stats, projectPath);
      } else {
        console.log(`Done bundling`);
      }

      onFinish(stats);
      resolve();
    };

    if (watch) {
      return webpackCompiler.watch({}, postRun);
    }

    return webpackCompiler.run(postRun);
  });
}

module.exports = makeBundle;
