const AppConstants = require("./sham/appconstants");
const { Chart } = require("./client/shared/widgets/Chart");
const { defer } = require("./shared/defer");
const { DebuggerClient } = require("./shared/client/main");
const { DebuggerTransport } = require("./transport/transport");
const DevToolsUtils = require("./shared/DevToolsUtils");
const EventEmitter = require("./shared/event-emitter");
const frame = require("./client/shared/components/frame");
const { gDevTools } = require("./client/framework/devtools");
const { HTMLTooltip } = require("./client/shared/widgets/tooltip/HTMLTooltip");
const { KeyCodes } = require("./client/shared/keycodes");
const { KeyShortcuts } = require("./client/shared/key-shortcuts");
const Menu = require("./client/framework/menu");
const MenuItem = require("./client/framework/menu-item");
const PrefsHelper = require("./client/shared/prefs").PrefsHelper;
const SearchBox = require("./client/shared/components/search-box");
const { setNamedTimeout } = require("./client/shared/widgets/view-helpers");
const sourceUtils = require("./client/shared/source-utils");
const Tabbar = require("./client/shared/components/tabs/tabbar");
const TabPanel = require("./client/shared/components/tabs/tabs");
const { TargetFactory } = require("./client/framework/target");
const { TimelineFront } = require("./client/shared/fronts/timeline");
const Tree = require("./client/shared/components/tree");
const WebsocketTransport = require("./shared/transport/websocket-transport");

module.exports = {
  AppConstants,
  Chart,
  frame,
  DebuggerClient,
  DebuggerTransport,
  DevToolsUtils,
  EventEmitter,
  gDevTools,
  HTMLTooltip,
  KeyCodes,
  KeyShortcuts,
  Menu,
  MenuItem,
  PrefsHelper,
  sourceUtils,
  SearchBox,
  setNamedTimeout,
  Tabbar,
  TabPanel,
  TargetFactory,
  TimelineFront,
  Tree,
  WebsocketTransport,
};
