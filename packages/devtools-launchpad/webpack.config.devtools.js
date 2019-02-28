const path = require("path");
const webpack = require("webpack");
const { NormalModuleReplacementPlugin } = webpack;

const { DefinePlugin } = webpack;

const nativeMapping = {
  react: "devtools/client/shared/vendor/react",
  "react-dom": "devtools/client/shared/vendor/react-dom",
  "react-dom-factories": "devtools/client/shared/vendor/react-dom-factories",
  "prop-types": "devtools/client/shared/vendor/react-prop-types",
  lodash: "devtools/client/shared/vendor/lodash"
};

const rootDir = path.join(__dirname, "../..");
const outputPath = process.env.OUTPUT_PATH;

module.exports = (webpackConfig, envConfig, options) => {
  if (outputPath) {
    webpackConfig.output.path = outputPath;
  }

  webpackConfig.devtool = false;
  const recordsPath =  options.recordsPath || "assets/module-manifest.json"
  webpackConfig.recordsPath = path.join(rootDir, recordsPath);
  
  function externalsTest(context, request, callback) {
    let mod = request;

    if (mod.match(/.*\/Services$/)) {
      callback(null, "Services");
      return;
    }

    // Any matching paths here won't be included in the bundle.
    const excludeMap = (options && options.excludeMap) || nativeMapping;
    if (excludeMap[mod]) {
      const mapping = excludeMap[mod];

      if (webpackConfig.externalsRequire) {
        // If the tool defines "externalsRequire" in the webpack config, wrap
        // all require to external dependencies with a call to the tool's
        // externalRequire method.
        let reqMethod = webpackConfig.externalsRequire;
        callback(null, `var ${reqMethod}("${mapping}")`);
      } else {
        callback(null, mapping);
      }
      return;
    }
    callback();
  }

  webpackConfig.externals = webpackConfig.externals || [];
  webpackConfig.externals.push(externalsTest);

  // Remove the existing DefinePlugin so we can override it.
  const plugins = webpackConfig.plugins.filter(
    p => !(p instanceof DefinePlugin)
  );
  webpackConfig.plugins = plugins.concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
        TARGET: JSON.stringify("firefox-panel")
      },
      "DebuggerConfig": JSON.stringify(envConfig)
    })
  ]);

  const mappings = [
    [/.\/src\/network-request/, "./src/privileged-network-request"],
  ];

  mappings.forEach(([regex, res]) => {
    webpackConfig.plugins.push(new NormalModuleReplacementPlugin(regex, res));
  });

  return webpackConfig;
};
