/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const sidePanelItems = {
  Firefox: {
    name: "Firefox",
    clientType: "firefox",
    paramName: "firefox-tab",
    docsUrlPart: "firefox"
  },
  Chrome: {
    name: "Chrome",
    clientType: "chrome",
    paramName: "chrome-tab",
    docsUrlPart: "chrome"
  },
  Node: {
    name: "Node",
    clientType: "node",
    paramName: "node-tab",
    docsUrlPart: "node"
  },
  Settings: {
    name: "Settings",
    clientType: "settings",
    paramName: "settings-tab",
    docsUrlPart: "settings"
  }
};

module.exports = {
  CLEAR_TABS: "CLEAR_TABS",
  ADD_TABS: "ADD_TABS",
  SELECT_TAB: "SELECT_TAB",
  FILTER_TABS: "FILTER_TABS",
  SET_VALUE: "SET_VALUE",
  SET_CONFIG: "SET_CONFIG",
  sidePanelItems
};
