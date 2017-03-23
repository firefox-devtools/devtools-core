/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { toolboxConfig } = require("devtools-launchpad/index");
const getConfig = require("./bin/getConfig");

const path = require("path");
const projectPath = path.join(__dirname, "src");

let webpackConfig = {
  context: path.join(__dirname, "."),
  entry: {
    bundle: [path.join(projectPath, "../index.js")],
    jsonview: [path.join(projectPath, "./main.js")],
  },

  output: {
    path: path.join(__dirname, "assets/build"),
    filename: "[name].js",
    publicPath: "/assets/build"
  }
};

webpackConfig.resolve = {
  alias: {
    "devtools/client/shared/vendor/react": "react",
    "devtools/client/shared/vendor/react-dom": "react-dom"
  }
};

const envConfig = getConfig();
module.exports = toolboxConfig(webpackConfig, envConfig);
