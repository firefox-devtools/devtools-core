const toolbox = require("devtools-local-toolbox/index");
const feature = require("devtools-config");
const getConfig = require("./getConfig");

const envConfig = getConfig();
feature.setConfig(envConfig);

const webpackConfig = require("../webpack.config");
toolbox.startDevServer(envConfig, webpackConfig);
