// @flow
const { Task } = require("./src/utils/task");
const firefox = require("./src/firefox");
const chrome = require("./src/chrome");
const { createSource } = require("./src/firefox/create");

import type {
  ConnectionTarget,
  Connection,
  TargetEnvironments,
  Actions,
  Tab
} from "./src/types";

let clientType: TargetEnvironments | null = null;
function getClient() {
  if (clientType === "chrome" || clientType === "node") {
    return chrome.clientCommands;
  }

  return firefox.clientCommands;
}

function startDebugging(
  connTarget: ConnectionTarget,
  actions: Actions) {
  if (connTarget.type === "node") {
    return startDebuggingNode(connTarget.param, actions);
  }

  return startDebuggingTab(connTarget, actions);
}

function startDebuggingNode(tabId: string, actions: Actions) {
  return Task.spawn(function* () {
    clientType = "node";

    const tabs = yield chrome.connectNodeClient();
    const tab = tabs.find(t => t.id.indexOf(tabId) !== -1);

    yield chrome.connectNode(tab.tab);
    chrome.initPage(actions, { clientType });

    return { tabs, tab, client: chrome };
  });
}

function startDebuggingTab(
  connTarget: ConnectionTarget,
  actions: Actions) {
  const client = connTarget.type === "chrome" ? chrome : firefox;
  return Task.spawn(function* () {
    const tabs: Tab[] = yield client.connectClient();
    const tab: ?Tab = tabs.find(t => t.id.indexOf(connTarget.param) !== -1);
    if (tab) {
      yield client.connectTab(tab.tab);

      clientType = connTarget.type;
      client.initPage(actions, { clientType });
    }
    return { tabs, tab, client };
  });
}

module.exports = {
  getClient,
  startDebugging,
  firefox,
  chrome,
  createSource
};
