// @flow
const firefox = require("./firefox");
const chrome = require("./chrome");

import type { ConnectionTarget, Tab } from "./types";

function startDebugging(connTarget: ConnectionTarget) {
  if (connTarget.type === "node") {
    return startDebuggingNode(connTarget.param);
  }

  return startDebuggingTab(connTarget);
}

async function startDebuggingNode(tabId: string) {
  const clientType = "node";
  const tabs = await chrome.connectNodeClient();
  if (!tabs) {
    return {};
  }

  const tab = tabs.find(t => t.id.indexOf(tabId) !== -1);

  if (!tab) {
    return {};
  }

  const tabConnection = await chrome.connectNode(tab.tab);
  chrome.initPage({ clientType, tabConnection });

  return { tabs, tab, clientType, client: chrome, tabConnection };
}

async function startDebuggingTab(connTarget: ConnectionTarget) {
  let clientType = connTarget.type;
  const client = clientType === "chrome" ? chrome : firefox;

  const tabs = await client.connectClient();

  if (!tabs) {
    return;
  }

  const tab: ?Tab = tabs.find(t => t.id.indexOf(connTarget.param) !== -1);
  if (!tab) {
    return;
  }

  const tabConnection = await client.connectTab(tab.tab);

  client.initPage({ tab, clientType, tabConnection });

  return { tab, tabConnection };
}

module.exports = {
  startDebugging,
  firefox,
  chrome,
};
