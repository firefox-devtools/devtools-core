/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const {
  DebuggerClient,
  DebuggerTransport,
  TargetFactory,
  WebsocketTransport
} = require("devtools-connection");

const { getValue } = require("devtools-config");
import type { Tab } from "./types";

import type {
  TabTarget,
  TabPayload,
  DebuggerClient as DebuggerClientType,
  ThreadClient
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
      clientType: "firefox"
    };
  });
}

async function connectClient() {
  const useWebSocket = getValue("firefox.webSocketConnection");
  const firefoxHost = useWebSocket ? getValue("firefox.host") : "localhost";
  const firefoxPort = getValue("firefox.webSocketPort");

  const socket = new WebSocket(`ws://${firefoxHost}:${firefoxPort}`);
  const transport = useWebSocket
    ? new WebsocketTransport(socket)
    : new DebuggerTransport(socket);

  debuggerClient = new DebuggerClient(transport);
  if (!debuggerClient) {
    return [];
  }

  try {
    await debuggerClient.connect();
    return await getTabs();
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

  const [, threadClient: ThreadClient] = await tabTarget.activeTab.attachThread({
    ignoreFrameEnvironment: true
  });

  threadClient.resume();
  return { debuggerClient, threadClient, tabTarget };
}

async function getTabs() {
  if (!debuggerClient || !debuggerClient.mainRoot) {
    return undefined;
  }

  const response = await debuggerClient.listTabs();
  return createTabs(response.tabs);
}

function initPage(options: Object) {}

module.exports = {
  connectClient,
  connectTab,
  initPage,
  getTabs
};
