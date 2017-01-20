// @flow

const CDP = require("chrome-remote-interface");
const { getValue } = require("devtools-config");
const networkRequest = require("devtools-network-request");
const { setupCommands, clientCommands } = require("./chrome/commands");
const { setupEvents, clientEvents } = require("./chrome/events");

// similar to Tab, but has webSocketDebuggerUrl
type ChromeTab = {
  webSocketDebuggerUrl: string,
  title: string,
  url: string,
  id: string,
  tab: any,
  type: string
}

let connection;

function createTabs(tabs: ChromeTab[], { type, clientType } = {}) {
  return tabs
    .filter(tab => {
      return tab.type == type;
    })
    .map(tab => {
      return {
        title: tab.title,
        url: tab.url,
        id: tab.id,
        tab,
        clientType
      };
    });
}

window.criRequest = function(options, callback) {
  const { host, port, path } = options;
  const url = `http://${host}:${port}${path}`;

  networkRequest(url)
    .then(res => callback(null, res.content))
    .catch(err => callback(err));
};

function connectClient() {
  if (!getValue("chrome.debug")) {
    return Promise.resolve(createTabs([]));
  }

  return CDP.List({
    port: getValue("chrome.port"),
    host: getValue("chrome.host")
  })
    .then(tabs => createTabs(tabs, {
      clientType: "chrome", type: "page"
    }));
}

function connectNodeClient() {
  if (!getValue("node.debug")) {
    return Promise.resolve(createTabs([]));
  }

  return CDP.List({
    port: getValue("node.port"),
    host: getValue("node.host")
  })
    .then(tabs => createTabs(tabs, {
      clientType: "node", type: "node"
    }));
}

function connectTab(tab: ChromeTab) {
  return CDP({ tab: tab.webSocketDebuggerUrl })
    .then(conn => {
      connection = conn;
    });
}

function connectNode(tab: ChromeTab) {
  return CDP({ tab: tab.webSocketDebuggerUrl })
    .then(conn => {
      connection = conn;
      window.addEventListener("beforeunload", () => {
        connection.onclose = function disable() {};
        connection.close();
      });
    });
}

function initPage(actions: any, { clientType }: any) {
  const { Debugger, Runtime, Page } = connection;

  setupCommands({ Debugger, Runtime, Page });
  setupEvents({ actions, Page, clientType });

  Debugger.enable();
  Debugger.setPauseOnExceptions({ state: "none" });
  Debugger.setAsyncCallStackDepth({ maxDepth: 0 });

  Runtime.enable();

  if (clientType == "node") {
    Runtime.runIfWaitingForDebugger();
  }

  if (clientType == "chrome") {
    Page.enable();
  }

  Debugger.scriptParsed(clientEvents.scriptParsed);
  Debugger.scriptFailedToParse(clientEvents.scriptFailedToParse);
  Debugger.paused(clientEvents.paused);
  Debugger.resumed(clientEvents.resumed);
}

module.exports = {
  connectClient,
  connectNodeClient,
  clientCommands,
  connectNode,
  connectTab,
  initPage
};
