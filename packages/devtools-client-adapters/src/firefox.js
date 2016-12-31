// @flow
const { DebuggerClient, DebuggerTransport,
        TargetFactory, WebsocketTransport } = require("devtools-sham-modules");
const { getValue } = require("devtools-config");
const { setupCommands, clientCommands } = require("./firefox/commands");
const { setupEvents, clientEvents } = require("./firefox/events");

import type { Tab } from './types';

import type {
  TabTarget,
  TabPayload,
  DebuggerClient as DebuggerClientType,
  Actions,
  ThreadClient
} from './firefox/types';

let debuggerClient: DebuggerClientType | null = null;
let threadClient: ThreadClient | null = null;
let tabTarget: TabTarget | null = null;

function getThreadClient(): ThreadClient | null {
  return threadClient;
}

function setThreadClient(client: ThreadClient | null) {
  threadClient = client;
}

function getTabTarget(): TabTarget | null {
  return tabTarget;
}

function setTabTarget(target: TabTarget | null) {
  tabTarget = target;
}

function lookupTabTarget(tab) {
  const options = { client: debuggerClient, form: tab, chrome: false };
  return TargetFactory.forRemoteTab(options);
}

function createTabs(tabs: TabPayload[]): Tab[] {
  return tabs.map(tab => {
    return {
      title: tab.title,
      url: tab.url,
      id: tab.actor,
      tab,
      clientType: "firefox"
    };
  });
}

function connectClient() {
  const useProxy = !getValue("firefox.webSocketConnection");
  const firefoxHost = getValue(
    useProxy ? "firefox.proxyHost" : "firefox.webSocketHost"
  );

  const socket = new WebSocket(`ws://${firefoxHost}`);
  const transport = useProxy ?
    new DebuggerTransport(socket) : new WebsocketTransport(socket);

  return new Promise((resolve, reject) => {
    debuggerClient = new DebuggerClient(transport);
    debuggerClient.connect().then(() => {
      if (debuggerClient !== null) {
        return debuggerClient.listTabs().then(response => {
          resolve(createTabs(response.tabs));
        });
      }
      return resolve([]);
    }).catch(err => {
      console.log(err);
      resolve([]);
    });
  });
}

function connectTab(tab: Tab) {
  return new Promise((resolve, reject) => {
    window.addEventListener("beforeunload", () => {
      const tt = getTabTarget();
      if (tt !== null) {
        tt.destroy();
      }
    });

    lookupTabTarget(tab).then(target => {
      tabTarget = target;
      target.activeTab.attachThread({}, (res, _threadClient) => {
        threadClient = _threadClient;
        threadClient.resume();
        resolve();
      });
    });
  });
}

function initPage(actions: Actions) {
  tabTarget = getTabTarget();
  threadClient = getThreadClient();
  if (threadClient !== null && tabTarget !== null && debuggerClient !== null) {
    setupCommands({ threadClient, tabTarget, debuggerClient });
  }

  if (actions && threadClient !== null) {
    // Listen to all the requested events.
    setupEvents({ threadClient, actions });
    Object.keys(clientEvents).forEach(eventName => {
      if (threadClient !== null) {
        threadClient.addListener(eventName, clientEvents[eventName]);
      }
    });
  }
}

module.exports = {
  connectClient,
  connectTab,
  clientCommands,
  clientEvents,
  getThreadClient,
  setThreadClient,
  getTabTarget,
  setTabTarget,
  initPage
};
