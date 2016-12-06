const { toolboxConfig } = require("devtools-local-toolbox/index");

const path = require("path");
const projectPath = path.join(__dirname, "src");

module.exports = envConfig => {
  let webpackConfig = {
    entry: {
      bundle: [path.join(projectPath, "toolbox.js")],
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
      "devtools/client/shared/vendor/react-dom": "react-dom",
      "Services": path.join(__dirname, "node_modules/devtools-modules/client/shared/shim/Services"),

      // these path aliases are incredibly stupid and WILL be replaced soon
      "devtools/client/shared/redux/middleware/thunk": path.join(projectPath, "lib/thunk.js"),
      "devtools/client/shared/components/reps/rep": path.join(projectPath, "lib/reps/rep.js"),
      "devtools/client/shared/components/reps/rep-utils": path.join(projectPath, "lib/reps/rep-utils.js"),
      "devtools/client/shared/components/reps/string": path.join(projectPath, "lib/reps/string.js"),
      "devtools/client/shared/components/reps/grip": path.join(projectPath, "lib/reps/grip.js"),
    }
  };

  return toolboxConfig(webpackConfig, envConfig);
}
