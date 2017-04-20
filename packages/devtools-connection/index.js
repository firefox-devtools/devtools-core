const { DebuggerClient } = require("./src/debugger/client");
const { DebuggerTransport } = require("./src/transport");
const WebsocketTransport = require("./src/transport/websocket");
const { TargetFactory } = require("./src/target");

module.exports = {
  DebuggerClient,
  DebuggerTransport,
  TargetFactory,
  WebsocketTransport,
};
