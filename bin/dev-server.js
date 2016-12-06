const toolbox = require("devtools-local-toolbox/index");
const feature = require("devtools-config");

function getConfig() {
  const developmentConfig = require("../configs/development.json");
  return developmentConfig;
}

const envConfig = getConfig();
feature.setConfig(envConfig);

const webpackConfig = require("../webpack.config")(envConfig);
// console.log(webpackConfig)
toolbox.startDevServer(envConfig, webpackConfig);
