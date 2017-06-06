/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { setConfig: _setConfig } = require("devtools-config");
const { updateTheme, updateDir } = require("../index");

/**
 * Redux actions for the pause state
 * @module actions/config
 */

const constants = require("../constants");
import type { ThunkArgs } from "./types";

/**
 * @typedef {Object} ConfigAction
 * @memberof actions/config
 * @static
 * @property {number} type The type of Action
 * @property {number} value The payload of the Action
 */

/**
 * @memberof actions/config
 * @static
 * @param {string} path
 * @param {string} value
 * @returns {ConfigAction} with type constants.SET_VALUE and value
 */
function setValue(path, value) {
  return async function({ dispatch }: ThunkArgs) {
    const response = await fetch("/setconfig", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, value })
    });

    const config = await response.json();
    _setConfig(config);
    updateTheme();
    updateDir();

    dispatch({
      type: constants.SET_VALUE,
      path,
      value
    });
  };
}

/**
 * @memberof actions/config
 * @static
 * @param {string} config
 * @returns {ConfigAction} with type constants.SET_CONFIG and config
 */
function setConfig(config) {
  return {
    type: constants.SET_CONFIG,
    config
  };
}

module.exports = {
  setValue,
  setConfig,
};
