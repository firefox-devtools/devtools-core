/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");

const toolbox = require("devtools-launchpad/index");
const express = require("express");

const envConfig = require("../configs/development.json");

const webpackConfig = toolbox.toolboxConfig(
  {
    entry: {
      styleguide: path.join(__dirname, "../src/index.js")
    },

    output: {
      path: path.join(__dirname, "assets/build"),
      filename: "[name].js",
      publicPath: "/assets/build"
    }
  },
  envConfig
);
// console.log(webpackConfig);
let { app } = toolbox.startDevServer(envConfig, webpackConfig, __dirname);

app.use("/styleguide", express.static("src"));
console.log(
  `>> GO TO http://localhost:${envConfig.development.serverPort}/styleguide`
);
