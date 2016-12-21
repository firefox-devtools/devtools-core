const developmentServer = require("./bin/development-server");
const toolboxConfig = require("./webpack.config");
const tools = require("./src/tools");

module.exports = {
  startDevServer: developmentServer.startDevServer,
  toolboxConfig,
  tools
};
