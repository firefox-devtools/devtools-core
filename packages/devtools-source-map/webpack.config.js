const { toolboxConfig } = require("devtools-launchpad/index");
const getConfig = require("./bin/getConfig");

const path = require("path");
const projectPath = path.join(__dirname, "src");

// Assumes you are building for integration with Firefox

let webpackConfig = {
  entry: {
    index: path.join(projectPath, "index.js"),
    worker: path.join(projectPath, "worker.js"),
  },

  output: {
    path: path.join(__dirname, "assets/build"),
    filename: "[name].js",
    libraryTarget: "umd",
  }
};

const envConfig = getConfig();
module.exports = toolboxConfig(webpackConfig, envConfig);
