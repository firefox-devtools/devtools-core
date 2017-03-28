// @flow
const {
  DebuggerClient,
  DebuggerTransport,
  TargetFactory,
  WebsocketTransport,
} = require("devtools-sham-modules");

const { getValue } = require("devtools-config");
import type { Tab } from "./types";

import type {
  TabTarget,
  TabPayload,
  DebuggerClient as DebuggerClientType,
  ThreadClient,
} from "./firefox-types";

let debuggerClient: DebuggerClientType | null = null;

function lookupTabTarget(tab) {
  const options = { client: debuggerClient, form: tab, chrome: false };
  return TargetFactory.forRemoteTab(options);
}

function createTabs(tabs: TabPayload[]): Tab[] {
  return tabs.map((tab: TabPayload) => {
    return {
      title: tab.title,
      url: tab.url,
      id: tab.actor,
      tab,
      clientType: "firefox",
    };
  });
}

async function connectClient() {
  const useProxy = !getValue("firefox.webSocketConnection");
  const firefoxHost = getValue(
    useProxy ? "firefox.proxyHost" : "firefox.webSocketHost"
  );

  const socket = new WebSocket(`ws://${firefoxHost}`);
  const transport = useProxy
    ? new DebuggerTransport(socket)
    : new WebsocketTransport(socket);

  debuggerClient = new DebuggerClient(transport);
  if (!debuggerClient) {
    return [];
  }

  try {
    await debuggerClient.connect();
    const tabs = await getTabs();
    return tabs;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function connectTab(tab: Tab) {
  window.addEventListener("beforeunload", () => {
    if (tabTarget !== null) {
      tabTarget.destroy();
    }
  });

  const tabTarget: TabTarget = await lookupTabTarget(tab);
  const [, threadClient: ThreadClient] =
    await tabTarget.activeTab.attachThread({});

  threadClient.resume();
  return { debuggerClient, threadClient, tabTarget };
}

async function getTabs() {
  if (!debuggerClient || !debuggerClient.mainRoot) {
    return;
  }

  const response = await debuggerClient.listTabs();
  return createTabs(response.tabs);
}

function initPage() {}

module.exports = {
  connectClient,
  connectTab,
  initPage,
  getTabs,
};
