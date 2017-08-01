/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require("path");
const webpack = require("webpack");
const process = require("process");

function makeBundle({ outputPath, projectPath, watch = false }) {
  process.env.TARGET = "firefox-panel";
  process.env.OUTPUT_PATH = outputPath;

  const webpackConfig = require(path.resolve(projectPath, "webpack.config.js"));

  return new Promise((resolve, reject) => {
    const webpackCompiler = webpack(webpackConfig);

    const postRun = (error, stats) => {
      if (stats.hasErrors()) {
        reject(stats.toJson("verbose"));
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
