/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const Menu = require("./src/menu");
const MenuItem = require("./src/menu/menu-item");
const { PrefsHelper } = require("./src/prefs");
const Services = require("./src/Services");
const { KeyShortcuts } = require("./src/key-shortcuts");
const { ZoomKeys } = require("./src/zoom-keys");
const EventEmitter = require("./src/utils/event-emitter");

module.exports = {
  KeyShortcuts,
  Menu,
  MenuItem,
  PrefsHelper,
  Services,
  ZoomKeys,
  EventEmitter
};
