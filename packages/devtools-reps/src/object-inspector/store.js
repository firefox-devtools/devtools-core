/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const { applyMiddleware, createStore } = require("redux");
const {thunk} = require("../shared/redux/middleware/thunk");
const {waitUntilService} = require("../shared/redux/middleware/waitUntilService");
const reducer = require("./reducer");

import type {
  Props,
  State,
} from "./types";

function createInitialState(overrides : Object) : State {
  return Object.assign({
    actors: new Set(),
    expandedPaths: new Set(),
    focusedItem: null,
    loadedProperties: new Map(),
  }, overrides);
}

module.exports = (props : Props) => {
  const middlewares = [thunk];
  if (props.injectWaitService) {
    middlewares.push(waitUntilService);
  }

  return createStore(
    reducer,
    createInitialState(props),
    applyMiddleware(...middlewares)
  );
};
