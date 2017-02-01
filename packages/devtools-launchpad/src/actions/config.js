/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/* global window */

/**
 * Redux actions for the pause state
 * @module actions/config
 */

const constants = require("../constants");

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
  return {
    type: constants.SET_VALUE,
    value
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
