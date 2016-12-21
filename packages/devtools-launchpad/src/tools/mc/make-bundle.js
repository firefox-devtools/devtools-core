const path = require("path");
const ps = require("child_process");
const processHandler = require("../utils/process-handler");

function makeBundle({ outputPath, projectPath, watch = false }) {
  const webpackConfigPath = path.resolve(projectPath, "webpack.config.js");

  let args = [`--config=${webpackConfigPath}`];
  if (watch) {
    args.push("--watch");
  }

  const options = {
    cwd: projectPath,
    env: Object.assign({}, process.env, {
      "TARGET": "firefox-panel",
      "OUTPUT_PATH": outputPath,
    })
  };

  return new Promise((resolve, reject) => {
    const webpack = ps.spawn("webpack", args, options);
    processHandler({ name: "webpack", proc: webpack, resolve, reject });
  });
}

module.exports = makeBundle;
