const AppConstants = require("./sham/appconstants");
const clipboardHelper = require("./shared/clipboard");
const DevToolsUtils = require("./shared/DevToolsUtils");
const EventEmitter = require("./shared/event-emitter");
const FileSaver = require("./client/shared/file-saver");
const frame = require("./client/shared/components/frame");
const Menu = require("./client/framework/menu");
const MenuItem = require("./client/framework/menu-item");
const networkRequest = require("./client/shared/shim/networkRequest");
const PrefsHelper = require("./client/shared/prefs").PrefsHelper;
const SearchBox = require("./client/shared/components/search-box");
const Services = require("./client/shared/shim/Services");
const sourceUtils = require("./client/shared/source-utils");
const SplitBox = require("./client/shared/components/splitter/SplitBox");
const sprintf = require("./shared/sprintf").sprintf;
const Tabbar = require("./client/shared/components/tabs/tabbar");
const TabPanel = require("./client/shared/components/tabs/tabs");
const Tree = require("./client/shared/components/tree");
const WebsocketTransport = require("./shared/transport/websocket-transport");
const workerUtils = require("./shared/worker-utils");
const { Chart } = require("./client/shared/widgets/Chart");
const { CurlUtils } = require("./client/shared/curl");
const { DebuggerClient } = require("./shared/client/main");
const { DebuggerTransport } = require("./transport/transport");
const defer = require("./shared/defer");
const { gDevTools } = require("./client/framework/devtools");
const { HTMLTooltip } = require("./client/shared/widgets/tooltip/HTMLTooltip");
const { KeyCodes } = require("./client/shared/keycodes");
const { KeyShortcuts } = require("./client/shared/key-shortcuts");
const { PluralForm } = require("./shared/plural-form");
const { setNamedTimeout } = require("./client/shared/widgets/view-helpers");
const { TargetFactory } = require("./client/framework/target");
const { TimelineFront } = require("./client/shared/fronts/timeline");
const { LocalizationHelper, localizeMarkup, MultiLocalizationHelper } = require("./shared/l10n");

module.exports = {
  AppConstants,
  Chart,
  CurlUtils,
  DebuggerClient,
  DebuggerTransport,
  defer,
  DevToolsUtils,
  EventEmitter,
  FileSaver,
  frame,
  gDevTools,
  HTMLTooltip,
  KeyCodes,
  KeyShortcuts,
  Menu,
  MenuItem,
  networkRequest,
  PluralForm,
  PrefsHelper,
  SearchBox,
  Services,
  setNamedTimeout,
  sourceUtils,
  SplitBox,
  LocalizationHelper,
  localizeMarkup,
  MultiLocalizationHelper,
  sprintf,
  Tabbar,
  TabPanel,
  TargetFactory,
  TimelineFront,
  Tree,
  WebsocketTransport,
  workerUtils,
  clipboardHelper,
};
