/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global window, document, DebuggerConfig */

const { bindActionCreators, combineReducers } = require("redux");
const { Provider } = require("react-redux");

const { defer } = require("./utils/defer");
const { debugGlobal } = require("./utils/debug");
const { setConfig, getValue, isDevelopment } = require("devtools-config");
const L10N = require("./utils/L10N");
const { showMenu, buildMenu } = require("./components/shared/menu");

setConfig(DebuggerConfig);

// Set various flags before requiring app code.
if (getValue("logging.client")) {
  // DevToolsUtils.dumpn.wantLogging = true;
}

const { firefox, chrome, startDebugging } = require("./client");
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
    method: "get",
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
      return Object.assign({}, args, {});
    },
  });

  const store = createStore(combineReducers(reducers));
  const actions = bindActionCreators(require("./actions"), store.dispatch);

  debugGlobal("launchpadStore", store);

  if (isDevelopment()) {
    const config = await updateConfig();
    actions.setConfig(config);
    // AppConstants.DEBUG_JS_MODULES = true;
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

  const root = Root("launchpad-root theme-body");
  mount.appendChild(root);

  if (component.props || component.propTypes) {
    _ReactDOM.render(
      createElement(Provider, { store: _store }, createElement(component)),
      root,
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

async function connectClients(actions) {
  const firefoxTabs = await firefox.connectClient();
  actions.newTabs(firefoxTabs);

  chrome.connectClient().then(actions.newTabs);

  chrome.connectNodeClient().then(actions.newTabs);
}

async function getTabs(actions) {
  const firefoxTabs = await firefox.getTabs();
  const chromeTabs = await chrome.connectClient();
  const nodeTabs = await chrome.connectNodeClient();

  actions.clearTabs();

  actions.newTabs(firefoxTabs);
  actions.newTabs(chromeTabs);
  actions.newTabs(nodeTabs);
}

async function bootstrap(React, ReactDOM) {
  const connTarget = getTargetFromQuery();
  if (connTarget) {
    const { tab, tabConnection } = await startDebugging(connTarget);

    await updateConfig();
    return { tab, connTarget, tabConnection };
  }

  const { store, actions, LaunchpadApp } = await initApp();
  renderRoot(React, ReactDOM, LaunchpadApp, store);
  await connectClients(actions);
  setInterval(async () => await getTabs(actions), 3000);

  return undefined;
}

module.exports = {
  bootstrap,
  buildMenu,
  debugGlobal,
  defer,
  renderRoot,
  L10N,
  showMenu,
  unmountRoot,
  updateTheme,
  updateDir,
};
