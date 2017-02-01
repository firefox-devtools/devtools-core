/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const constants = require("../constants");
const fromJS = require("../utils/fromJS");

const initialState = fromJS({
  config: {}
});

function update(state = initialState, action) {
  switch (action.type) {
    case constants.SET_VALUE:
      return state.setIn(["config", ...action.key.split(".")], action.value);

    case constants.SET_CONFIG:
      return state.setIn(["config"], action.config);
  }

  return state;
}

module.exports = update;
