require("babel-register");

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { isDevelopment, isFirefoxPanel, getValue, setConfig } = require("devtools-config");
const NODE_ENV = process.env.NODE_ENV || "development";
const TARGET = process.env.TARGET || "local";

const defaultBabelPlugins = [
  "transform-flow-strip-types",
  "transform-async-to-generator"
];

module.exports = (webpackConfig, envConfig) => {
  setConfig(envConfig);

  webpackConfig.context = path.resolve(__dirname, "src");
  webpackConfig.devtool = "source-map";

  webpackConfig.module = webpackConfig.module || {};
  webpackConfig.module.rules = webpackConfig.module.rules || [];
  webpackConfig.module.rules.push({
    test: /\.json$/,
    loader: "json-loader"
  });
  webpackConfig.module.rules.push({
    test: /\.js$/,
    exclude: request => {
      // Some paths are excluded from Babel
      let excludedPaths = ["fs", "node_modules"];
      let excludedRe = new RegExp(`(${excludedPaths.join("|")})`);
      let excluded = !!request.match(excludedRe);

      if (webpackConfig.babelExcludes) {
        // If the tool defines an additional exclude regexp for Babel.
        excluded = excluded || !!request.match(webpackConfig.babelExcludes);
      }
      return excluded && !request.match(/node_modules(\/|\\)devtools-/);
    },
    loader: `babel-loader?${defaultBabelPlugins.map(p => `plugins[]=${p}`)}&ignore=src/lib`,
    // isJavaScriptLoader: true
  });
  webpackConfig.module.rules.push({
    test: /\.svg$/,
    loader: "svg-inline-loader"
  });

  webpackConfig.module.rules.push({
    test: /\.properties$/,
    loader: "raw-loader"
  });

  // Add resolveLoader for ./node_modules to fix issues when synlinked.
  webpackConfig.resolveLoader = webpackConfig.resolveLoader || {};
  webpackConfig.resolveLoader.modules = webpackConfig.resolveLoader.modules || [];
  webpackConfig.resolveLoader.modules.push("node_modules");
  webpackConfig.resolveLoader.modules.push(path.resolve(__dirname, "./node_modules"));

  // Add a resolve alias for React if the target is UMD
  if (webpackConfig.output && webpackConfig.output.libraryTarget === "umd") {
    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
    if (!webpackConfig.resolve.alias.react) {
      webpackConfig.resolve.alias.react = "react/lib/ReactUMDEntry";
    }
  }

  webpackConfig.node = { fs: "empty" };

  webpackConfig.plugins = webpackConfig.plugins || [];
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV),
        TARGET: JSON.stringify(TARGET)
      },
      DebuggerConfig: JSON.stringify(envConfig)
    })
  );

  if (isDevelopment()) {
    webpackConfig.module.rules.push({
      test: /\.css$/,
      loader: "style-loader!css-loader!postcss-loader"
    });

    if (getValue("hotReloading")) {
      Object.keys(webpackConfig.entry).forEach(key => {
        webpackConfig.entry[key].push("webpack-hot-middleware/client");
      });

      webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ]);

      webpackConfig.module.rules.forEach(spec => {
        if (spec.isJavaScriptLoader) {
          spec.rules.unshift("react-hot-loader");
        }
      });
    }
  } else {
    // Extract CSS into a single file
    webpackConfig.module.rules.push({
      test: /\.css$/,
      exclude: request => {
        // If the tool defines an exclude regexp for CSS files.
        return (
          webpackConfig.cssExcludes && request.match(webpackConfig.cssExcludes)
        );
      },
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: path.resolve(__dirname, "postcss.config.js")
              }
            }
          }
        ]
      })
    });

    webpackConfig.plugins.push(new ExtractTextPlugin("[name].css"));
  }

  if (isFirefoxPanel()) {
    webpackConfig = require("./webpack.config.devtools")(
      webpackConfig,
      envConfig
    );
  }

  // NOTE: This is only needed to fix a bug with chrome devtools' debugger and
  // destructuring params https://github.com/devtools-html/debugger.html/issues/67
  if (getValue("transformParameters")) {
    webpackConfig.module.rules.forEach(spec => {
      if (spec.isJavaScriptLoader) {
        const idx = spec.rules.findIndex(loader => loader.includes("babel-loader"));
        spec.rules[idx] += "&plugins[]=transform-es2015-parameters";
      }
    });
  }

  return webpackConfig;
};
