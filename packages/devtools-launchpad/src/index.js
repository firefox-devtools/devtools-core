/* global window, document, DebuggerConfig */

const { bindActionCreators, combineReducers } = require("redux");
const { Provider } = require("react-redux");

const { DevToolsUtils, AppConstants } = require("devtools-sham-modules");
const { debugGlobal } = require("./utils/debug");
const { setConfig, getValue, isDevelopment } = require("devtools-config");
const L10N = require("./utils/L10N");
const { showMenu, buildMenu } = require("./menu");

setConfig(DebuggerConfig);

// Set various flags before requiring app code.
if (getValue("logging.client")) {
  DevToolsUtils.dumpn.wantLogging = true;
}

const { getClient, firefox, chrome, startDebugging } = require("devtools-client-adapters");
const Root = require("./components/Root");

// Using this static variable allows webpack to know at compile-time
// to avoid this require and not include it at all in the output.
if (process.env.TARGET !== "firefox-panel") {
  require("./lib/themes/dark-theme.css");
  require("./lib/themes/light-theme.css");
  require("./lib/themes/firebug-theme.css");
}

function updateTheme() {
  if (process.env.TARGET !== "firefox-panel") {
    const theme = getValue("theme");
    const root = document.body.parentNode;
    const appRoot = document.querySelector(".launchpad-root");

    root.className = "";
    appRoot.className = "launchpad-root";

    root.classList.add(`theme-${theme}`);
    appRoot.classList.add(`theme-${theme}`);
  }
}

function updateDir() {
  const dir = getValue("dir");
  const root = document.body.parentNode;
  root.dir = dir;
}

async function updateConfig() {
  const response = await fetch("/getconfig", {
    method: "get"
  });

  const config = await response.json();
  setConfig(config);
  return config;
}

async function initApp() {
  const configureStore = require("./utils/create-store");
  const reducers = require("./reducers");
  const LaunchpadApp = require("./components/LaunchpadApp");

  const createStore = configureStore({
    log: getValue("logging.actions"),
    makeThunkArgs: (args, state) => {
      return Object.assign({}, args, { client: getClient(state) });
    }
  });

  const store = createStore(combineReducers(reducers));
  const actions = bindActionCreators(require("./actions"), store.dispatch);

  debugGlobal("launchpadStore", store);

  if (isDevelopment()) {
    const config = await updateConfig();
    actions.setConfig(config);
    AppConstants.DEBUG_JS_MODULES = true;
  }

  return { store, actions, LaunchpadApp };
}

function renderRoot(_React, _ReactDOM, component, _store) {
  const { createElement } = _React;
  const mount = document.querySelector("#mount");

  // bail in test environments that do not have a mount
  if (!mount) {
    return;
  }

  const root = Root("launchpad-root");
  mount.appendChild(root);

  if (component.props || component.propTypes) {
    _ReactDOM.render(
      createElement(Provider, { store: _store }, createElement(component)),
      root
    );
  } else {
    root.appendChild(component);
  }

  if (isDevelopment()) {
    updateConfig();
    updateTheme();
  }
}

function unmountRoot(_ReactDOM) {
  const mount = document.querySelector("#mount .launchpad-root");
  _ReactDOM.unmountComponentAtNode(mount);
}

function getTargetFromQuery() {
  const href = window.location.href;
  const nodeMatch = href.match(/node-tab=([^&#]*)/);
  const firefoxMatch = href.match(/firefox-tab=([^&#]*)/);
  const chromeMatch = href.match(/chrome-tab=([^&#]*)/);

  if (nodeMatch) {
    return { type: "node", param: nodeMatch[1] };
  } else if (firefoxMatch) {
    return { type: "firefox", param: firefoxMatch[1] };
  } else if (chromeMatch) {
    return { type: "chrome", param: chromeMatch[1] };
  }

  return null;
}

async function getTabs(actions) {
  actions.clearTabs();
  const chromeTabs = await chrome.connectClient();
  actions.newTabs(chromeTabs);

  const nodeTabs = await chrome.connectNodeClient();
  actions.newTabs(nodeTabs);

  const firefoxTabs = await firefox.connectClient();
  actions.newTabs(firefoxTabs);
}

async function bootstrap(React, ReactDOM, App, appActions, appStore) {
  const connTarget = getTargetFromQuery();
  if (connTarget) {
    const { tab, client } = await startDebugging(
      connTarget, appActions
    );

    await updateConfig();
    debugGlobal("client", client.clientCommands);
    renderRoot(React, ReactDOM, App, appStore);
    return { tab, connTarget, client };
  }

  const { store, actions, LaunchpadApp } = await initApp();
  renderRoot(React, ReactDOM, LaunchpadApp, store);
  await getTabs(actions);
  setInterval(async () => await getTabs(actions), 5000);
}

module.exports = {
  bootstrap,
  renderRoot,
  unmountRoot,
  debugGlobal,
  L10N,
  showMenu,
  buildMenu,
  updateTheme,
  updateDir
};
