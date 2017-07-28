/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function getExpressions(state) {
  return state.expressions;
}

function getInputState(state) {
  return state.input;
}

function getCurrentInputValue(state) {
  return getInputState(state).get("currentValue");
}

function getObjectState(state) {
  return state.objects;
}

function getLoadedObjectProperties(state) {
  return getObjectState(state).properties;
}

function getLoadedObjectEntries(state) {
  return getObjectState(state).entries;
}

module.exports = {
  getCurrentInputValue,
  getExpressions,
  getLoadedObjectEntries,
  getLoadedObjectProperties,
};
