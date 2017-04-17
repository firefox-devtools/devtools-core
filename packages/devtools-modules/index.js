const AppConstants = require("./sham/appconstants");
const clipboardHelper = require("./shared/clipboard");
const DevToolsUtils = require("./shared/DevToolsUtils");
const EventEmitter = require("./shared/event-emitter");
const Menu = require("./client/framework/menu");
const MenuItem = require("./client/framework/menu-item");
const networkRequest = require("./client/shared/shim/networkRequest");
const PrefsHelper = require("./client/shared/prefs").PrefsHelper;
const Services = require("./client/shared/shim/Services");
const sourceUtils = require("./client/shared/source-utils");
const sprintf = require("./shared/sprintf").sprintf;
const Tree = require("./client/shared/components/tree");
const WebsocketTransport = require("./shared/transport/websocket-transport");
const workerUtils = require("./shared/worker-utils");
const { CurlUtils } = require("./client/shared/curl");
const { DebuggerClient } = require("./shared/client/main");
const { DebuggerTransport } = require("./transport/transport");
const defer = require("./shared/defer");
const { gDevTools } = require("./client/framework/devtools");
const { KeyShortcuts } = require("./client/shared/key-shortcuts");
const { PluralForm } = require("./shared/plural-form");
const { TargetFactory } = require("./client/framework/target");
const { TimelineFront } = require("./client/shared/fronts/timeline");

module.exports = {
  AppConstants,
  CurlUtils,
  DebuggerClient,
  DebuggerTransport,
  defer,
  DevToolsUtils,
  EventEmitter,
  gDevTools,
  KeyShortcuts,
  Menu,
  MenuItem,
  networkRequest,
  PluralForm,
  PrefsHelper,
  Services,
  sourceUtils,
  sprintf,
  TargetFactory,
  TimelineFront,
  Tree,
  WebsocketTransport,
  workerUtils,
  clipboardHelper,
};
