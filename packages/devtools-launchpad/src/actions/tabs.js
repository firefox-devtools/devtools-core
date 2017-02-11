/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 /* global window */

/**
 * Redux actions for the pause state
 * @module actions/tabs
 */

const constants = require("../constants");

/**
 * @typedef {Object} TabAction
 * @memberof actions/tabs
 * @static
 * @property {number} type The type of Action
 * @property {number} value The payload of the Action
 */

 /**
  * @memberof actions/tabs
  * @static
  * @returns {TabAction} with type constants.CLEAR_TABS and tabs as value
  */
function clearTabs() {
  return {
    type: constants.CLEAR_TABS
  };
}

/**
 * @memberof actions/tabs
 * @static
 * @param {Array} tabs
 * @returns {TabAction} with type constants.ADD_TABS and tabs as value
 */
function newTabs(tabs) {
  return ({ getState, dispatch }) => {
    return dispatch({
      type: constants.ADD_TABS,
      value: tabs
    });
  };
}

/**
 * @memberof actions/tabs
 * @static
 * @param {String} $0.id Unique ID of the tab to select
 * @returns {TabAction}
 */
function selectTab({ id }) {
  return {
    type: constants.SELECT_TAB,
    id: id,
  };
}

/**
 * @memberof actions/tabs
 * @static
 * @param {String} value String which should be used to filter tabs
 * @returns {TabAction} with type constants.FILTER_TABS
 *          and filter string as value
 */
function filterTabs(value) {
  return {
    type: constants.FILTER_TABS,
    value
  };
}

module.exports = {
  newTabs,
  selectTab,
  filterTabs,
  clearTabs
};
