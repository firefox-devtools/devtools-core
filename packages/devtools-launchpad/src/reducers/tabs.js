/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const constants = require("../constants");
const Immutable = require("immutable");
const fromJS = require("../utils/fromJS");

const initialState = fromJS({
  tabs: {},
  selectedTab: null,
  filterString: "",
});

function update(state = initialState, action) {
  switch (action.type) {
    case constants.CLEAR_TABS:
      return state.setIn(["tabs"], Immutable.Map())
        .setIn(["selectedTab"], null);

    case constants.ADD_TABS:
      const tabs = action.value;
      if (!tabs) {
        return state;
      }

      return state.mergeIn(
        ["tabs"],
        Immutable.Map(tabs.map(tab => {
          tab = Object.assign({}, tab, { id: getTabId(tab) });
          return [tab.id, Immutable.Map(tab)];
        }))
      );

    case constants.SELECT_TAB:
      const tabToSelect = state.getIn(["tabs", action.id]);
      return state.setIn(["selectedTab"], tabToSelect);

    case constants.FILTER_TABS:
      return state.setIn(["filterString"], action.value);
  }

  return state;
}

function getTabId(tab) {
  let id = tab.id;
  const isFirefox = tab.clientType == "firefox";

  // NOTE: we're getting the last part of the actor because
  // we want to ignore the connection id
  if (isFirefox) {
    id = tab.id.split(".").pop();
  }

  return id;
}

module.exports = update;
