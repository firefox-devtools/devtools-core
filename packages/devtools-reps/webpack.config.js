/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { toolboxConfig } = require("devtools-launchpad/index");
const getConfig = require("./bin/getConfig");
const {isDevelopment, isFirefoxPanel} = require("devtools-config");

const path = require("path");
const projectPath = path.join(__dirname, "src");

let webpackConfig = {
  entry: {
    reps: [path.join(projectPath, "launchpad/index.js")],
  },

  output: {
    path: path.join(__dirname, "assets/build"),
    filename: "[name].js",
    publicPath: "/assets/build"
  }
};

if (isFirefoxPanel()) {
  // Just use the entrypoint in the panel
  webpackConfig.entry.reps = path.join(projectPath, "index.js");

  // export via commonjs2 `module.exports`
  webpackConfig.output.libraryTarget = "umd";
}

webpackConfig.resolve = {
  alias: {
    "devtools/client/shared/vendor/react": "react",
    "devtools/client/shared/vendor/react-dom": "react-dom",
    "devtools/client/shared/vendor/react-dom-factories": "react-dom-factories",
    "devtools/client/shared/vendor/react-prop-types": "prop-types",
    "Services": path.join(__dirname,
      "node_modules/devtools-modules/client/shared/shim/Services"),
  }
};

const extra = {};
webpackConfig.plugins = [];
if (!isDevelopment()) {
  webpackConfig.output.libraryTarget = "umd";

  extra.excludeMap = {
    react: "devtools/client/shared/vendor/react",
    "react-dom": "devtools/client/shared/vendor/react-dom",
    "react-dom-factories": "devtools/client/shared/vendor/react-dom-factories",
    "prop-types": "devtools/client/shared/vendor/react-prop-types",
    lodash: "devtools/client/shared/vendor/lodash",
  };
}

const envConfig = getConfig();
module.exports = toolboxConfig(webpackConfig, envConfig, extra);
