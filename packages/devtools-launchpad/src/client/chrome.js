/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

// STUBBED CDP because of https://github.com/devtools-html/devtools-core/issues/410
const CDP = require("chrome-remote-interface");
const { getValue } = require("devtools-config");
const { networkRequest } = require("devtools-utils");

import type { Tab } from "./types";

type ChromeTab = Tab & {
  webSocketDebuggerUrl: string,
  type: string
};

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

async function connectClient() {
  if (!getValue("chrome.debug")) {
    return createTabs([]);
  }

  try {
    const tabs = await CDP.List({
      port: getValue("chrome.port"),
      host: getValue("chrome.host")
    });

    return createTabs(tabs, {
      clientType: "chrome",
      type: "page"
    });
  } catch (e) {
    return [];
  }
}

async function connectNodeClient() {
  if (!getValue("node.debug")) {
    return createTabs([]);
  }

  let tabs;
  try {
    tabs = await CDP.List({
      port: getValue("node.port"),
      host: getValue("node.host")
    });
  } catch (e) {
    return undefined;
  }

  return createTabs(tabs, {
    clientType: "node",
    type: "node"
  });
}

async function connectTab(tab: ChromeTab) {
  const tabConnection = await CDP({ tab: tab.webSocketDebuggerUrl });
  return tabConnection;
}

async function connectNode(tab: ChromeTab) {
  const tabConnection = await CDP({ tab: tab.webSocketDebuggerUrl });

  window.addEventListener("beforeunload", () => {
    tabConnection.onclose = function disable() {};
    tabConnection.close();
  });

  return tabConnection;
}

function initPage({ tab, clientType, tabConnection }: any) {
  const { Runtime, Page } = tabConnection;

  Runtime.enable();

  if (clientType == "node") {
    Runtime.runIfWaitingForDebugger();
  }

  if (clientType == "chrome") {
    Page.enable();
  }

  return connection;
}

module.exports = {
  connectClient,
  connectNodeClient,
  connectNode,
  connectTab,
  initPage
};
