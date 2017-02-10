const { toolboxConfig } = require("devtools-launchpad/index");
const getConfig = require("./bin/getConfig");
const {isFirefoxPanel} = require("devtools-config");

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
    "Services": path.join(__dirname,
      "node_modules/devtools-modules/client/shared/shim/Services"),
  }
};

const envConfig = getConfig();
module.exports = toolboxConfig(webpackConfig, envConfig);
