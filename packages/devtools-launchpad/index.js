const developmentServer = require("./bin/development-server");
const toolboxConfig = require("./webpack.config");
const tools = require("./src/tools");
const developmentConfig = require("./configs/development.json");

module.exports = {
  startDevServer: developmentServer.startDevServer,
  toolboxConfig,
  developmentConfig,
  tools
};
