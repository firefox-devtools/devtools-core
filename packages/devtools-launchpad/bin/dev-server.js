/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path = require("path");
const feature = require("devtools-config");
const toolbox = require("../index");

const devConfig = toolbox.developmentConfig;
feature.setConfig(devConfig);

function buildwebpackConfig(envConfig) {
  let webpackConfig = {
    entry: {
      launchpad: path.join(__dirname, "../src/main")
    },

    output: {
      path: path.join(__dirname, "assets/build"),
      filename: "[name].js",
      publicPath: "/assets/build"
    }
  };

  return toolbox.toolboxConfig(webpackConfig, envConfig);
}

const webpackConfig = buildwebpackConfig(devConfig);
toolbox.startDevServer(devConfig, webpackConfig, __dirname);
