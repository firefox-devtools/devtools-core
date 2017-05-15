const fs = require("fs");
const path = require("path");

const toolbox = require("devtools-launchpad/index");
const express = require("express");

const envConfig = {
  development: {
    serverPort: 8002
  },
  firefox: {
    webSocketConnection: false,
    proxyHost: "localhost:9001",
    webSocketHost: "localhost:6080",
    mcPath: "./firefox"
  }
};

const webpackConfig = toolbox.toolboxConfig(
  {
    entry: {
      examples: path.join(__dirname, "../examples/index.js")
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

app.use("/editor", express.static("examples"));
console.log(
  `>> GO TO http://localhost:${envConfig.development.serverPort}/editor/`
);
