
require("babel-register");

const path = require("path");
const webpack = require("webpack");
const DefinePlugin = webpack.DefinePlugin;
// const SingleModulePlugin = require("single-module-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { isDevelopment, isFirefoxPanel, getValue } = require("devtools-config");
const postcssBidirection = require("postcss-bidirection");
const NODE_ENV = process.env.NODE_ENV || "development";
const TARGET = process.env.TARGET || "local";

const defaultBabelPlugins = [
  "transform-flow-strip-types",
  "transform-async-to-generator",
  "transform-es2015-classes",
  "transform-es2015-modules-commonjs"
];

module.exports = (webpackConfig, envConfig) => {
  webpackConfig.context = path.resolve(__dirname, "src");
  webpackConfig.devtool = "source-map";

  webpackConfig.module = webpackConfig.module || {};
  webpackConfig.module.rules = webpackConfig.module.rules || [];
  webpackConfig.module.rules.push({
    test: /\.js$/,
    exclude: request => {
      let excludedPaths = [
        "bower_components",
        "fs",
        "node_modules",
        // All devtools-core packages should be excluded from babel translation,
        // except devtools-client-adapters and devtools-launchpad.
        "devtools-config",
        "devtools-modules",
        "devtools-network-request",
        "devtools-reps",
        "devtools-sham-modules",
      ];
      // Create a regexp matching any of the paths in excludedPaths
      let excludedRe = new RegExp(`(${ excludedPaths.join("|") })`);
      let excluded = request.match(excludedRe);

      if (webpackConfig.babelExcludes) {
        // If the tool defines an additional exclude regexp for Babel.
        excluded = excluded || request.match(webpackConfig.babelExcludes);
      }
      return excluded && !request.match(/devtools-launchpad(\/|\\)src/)
              && !request.match(/devtools-client-adapters(\/|\\)src/);
    },
    loader: "babel-loader",
    options: {
      plugins: defaultBabelPlugins,
      ignore: "src/lib"
    }
  });

  webpackConfig.module.rules.push({
    test: /\.svg$/,
    loader: "svg-inline-loader"
  });

  // // Add resolveLoader for ./node_modules to fix issues when synlinked.
  // webpackConfig.resolveLoader = webpackConfig.resolveLoader || {};
  // webpackConfig.resolveLoader.root = webpackConfig.resolveLoader.root || [];
  // webpackConfig.resolveLoader.root.push(path.resolve("./node_modules"));

  // const ignoreRegexes = [/^fs$/];
  // webpackConfig.externals = webpackConfig.externals || [];
  //
  // function externalsTest(context, request, callback) {
  //   // Any matching paths here won't be included in the bundle.
  //   if (ignoreRegexes.some(r => r.test(request))) {
  //     return callback(null, "var {}");
  //   }
  //
  //   callback();
  // }
  // webpackConfig.externals.push(externalsTest);

  webpackConfig.resolve = webpackConfig.resolve || {};
  webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
  webpackConfig.resolve.alias.fs = "no-op";

  webpackConfig.plugins = webpackConfig.plugins || [];
  webpackConfig.plugins.push(
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV),
        TARGET: JSON.stringify(TARGET)
      },
      "DebuggerConfig": JSON.stringify(envConfig)
    })
  );

  if (getValue("bundleAnalyzer")) {
    webpackConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "server",
        analyzerPort: 8888,
        reportFilename: "report.html",
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: "stats.json",
        statsOptions: null,
        logLevel: "info"
      })
    );
  }

  if (isDevelopment()) {
    webpackConfig.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: "postcss-loader",
          options: {
            plugins: [postcssBidirection]
          }
        }
      ]
    });

    // if (getValue("hotReloading")) {
    //   Object.keys(webpackConfig.entry).forEach(key => {
    //     webpackConfig.entry[key].push("webpack-hot-middleware/client");
    //   });
    //
    //   webpackConfig.plugins = webpackConfig.plugins.concat([
    //     new webpack.HotModuleReplacementPlugin(),
    //     new webpack.NoErrorsPlugin()
    //   ]);
    //
    //   webpackConfig.module.rules.forEach(spec => {
    //     if (spec.isJavaScriptLoader) {
    //       spec.use.unshift("react-hot-loader");
    //     }
    //   });
    // }
  } else {
  // Extract CSS into a single file
    webpackConfig.module.rules.push({
      test: /\.css$/,
      exclude: request => {
        // If the tool defines an exclude regexp for CSS files.
        return webpackConfig.cssExcludes
          && request.match(webpackConfig.cssExcludes);
      },
      loader: ExtractTextPlugin.extract({
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      })
    });

    webpackConfig.plugins.push(new ExtractTextPlugin({
      filename: "[name].css"
    }));
  }

  if (isFirefoxPanel()) {
    webpackConfig = require("./webpack.config.devtools")(webpackConfig, envConfig);
  }

  // NOTE: This is only needed to fix a bug with chrome devtools' debugger and
  // destructuring params https://github.com/devtools-html/debugger.html/issues/67
  // if (getValue("transformParameters")) {
  //   webpackConfig.module.rules.forEach(spec => {
  //     if (spec.isJavaScriptLoader) {
  //       const idx = spec.use.findIndex(loader => loader.includes("babel"));
  //       spec.use[idx] += "&plugins[]=transform-es2015-parameters";
  //     }
  //   });
  // }

  return webpackConfig;
};
