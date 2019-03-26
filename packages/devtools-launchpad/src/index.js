/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global window, document, DebuggerConfig */

const { bindActionCreators, combineReducers } = require("redux");
const { Provider } = require("react-redux");

const { defer } = require("./utils/defer");
const { debugGlobal } = require("./utils/debug");
const { setConfig, getValue } = require("devtools-config");
const { isDevelopment } = require("devtools-environment");
const L10N = require("./utils/L10N");
const { showMenu, buildMenu } = require("devtools-contextmenu");

setConfig(DebuggerConfig);

// List of theme class names to ignore when replacing a theme.
// Certain nodes may contain multiple "theme-" classes and some of them we must
// preserve.
const IGNORE_THEME_CLASS_NAMES = ["theme-body"];

// Set various flags before requiring app code.
if (getValue("logging.client")) {
  // DevToolsUtils.dumpn.wantLogging = true;
}

const { firefox, chrome, startDebugging } = require("./client");
const Root = require("./components/Root");

// Using this static variable allows webpack to know at compile-time
// to avoid this require and not include it at all in the output.
if (process.env.TARGET !== "firefox-panel") {
  require("devtools-mc-assets/assets/devtools/client/themes/light-theme.css");
  require("devtools-mc-assets/assets/devtools/client/themes/dark-theme.css");
}

function setThemeClassName(targetNode, newThemeClassName) {
  // If one of the arguments is missing - bail out.
  if (!targetNode || !newThemeClassName) {
    return;
  }

  const { classList } = targetNode;

  // Attempt to find the first theme class, assuming there's only one and
  // ignoring class names from IGNORE_THEME_CLASS_NAMES array.
  const activeThemeClassName = [...classList].find(
    cls => cls.startsWith("theme-") && !IGNORE_THEME_CLASS_NAMES.includes(cls)
  );

  if (activeThemeClassName) {
    classList.replace(activeThemeClassName, newThemeClassName);
  } else {
    classList.add(newThemeClassName);
  }
}

function updateTheme() {
  if (process.env.TARGET !== "firefox-panel") {
    setThemeClassName(document.documentElement, `theme-${getValue("theme")}`);
  }
}

function updatePlatform() {
  if (process.env.TARGET !== "firefox-panel") {
    document.documentElement.setAttribute("platform", getPlatform());
  }
}

function getPlatform() {
  const agent = navigator.userAgent.toLowerCase();
  if (agent.includes("windows")) {
    return "win";
  } else if (agent.includes("mac os")) {
    return "mac";
  }
  return "linux";
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
      return Object.assign({}, args, {});
    }
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

function renderRoot(_React, _ReactDOM, component, _store, props) {
  const { createElement } = _React;
  const mount = document.querySelector("#mount");

  // bail in test environments that do not have a mount
  if (!mount) {
    return;
  }

  const className = "launchpad-root theme-body";
  const root = Root(className);
  mount.appendChild(root);

  if (isDevelopment()) {
    updateConfig();
    updateTheme();
    updatePlatform();
  }

  if (component.props || component.propTypes) {
    _ReactDOM.render(
      createElement(
        Provider,
        { store: _store },
        createElement(component, props)
      ),
      root
    );
  } else {
    root.appendChild(component);
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
  const firefoxTabs = await firefox.connectClient();
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
    const debuggedTarget = await startDebugging(connTarget);

    if (debuggedTarget) {
      const { tab, tabConnection } = debuggedTarget;
      await updateConfig();
      return { tab, connTarget, tabConnection };
    }

    console.info("Tab closed due to missing debugged target window.");
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
  updateDir
};
