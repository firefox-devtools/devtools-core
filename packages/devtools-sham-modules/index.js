const AppConstants = require("./sham/appconstants");
const { DebuggerClient } = require("./shared/client/main");
const { DebuggerTransport } = require("./transport/transport");
const DevToolsUtils = require("./shared/DevToolsUtils");
const EventEmitter = require("./shared/event-emitter");
const frame = require("./client/shared/components/frame");
const { KeyShortcuts } = require("./client/shared/key-shortcuts");
const Menu = require("./client/framework/menu");
const MenuItem = require("./client/framework/menu-item");
const PrefsHelper = require("./client/shared/prefs").PrefsHelper;
const SearchBox = require("./client/shared/components/search-box");
const sourceUtils = require("./client/shared/source-utils");
const Tabbar = require("./client/shared/components/tabs/tabbar");
const TabPanel = require("./client/shared/components/tabs/tabs");
const { TargetFactory } = require("./client/framework/target");
const Tree = require("./client/shared/components/tree");
const WebsocketTransport = require("./shared/transport/websocket-transport");

module.exports = {
  AppConstants,
  frame,
  DebuggerClient,
  DebuggerTransport,
  DevToolsUtils,
  EventEmitter,
  KeyShortcuts,
  Menu,
  MenuItem,
  PrefsHelper,
  sourceUtils,
  SearchBox,
  Tabbar,
  TabPanel,
  TargetFactory,
  Tree,
  WebsocketTransport,
};
