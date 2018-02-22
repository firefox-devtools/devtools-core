/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @flow

import type {
  ReduxAction,
  State,
} from "./types";

function reducer(
  state: State = {},
  action: ReduxAction
) : State {
  const {
    type,
    data,
  } = action;

  const cloneState = overrides => Object.assign({}, state, overrides);

  if (type === "NODE_EXPAND") {
    return cloneState({
      expandedPaths: new Set(state.expandedPaths).add(data.node.path)
    });
  }

  if (type === "NODE_COLLAPSE") {
    const expandedPaths = new Set(state.expandedPaths);
    expandedPaths.delete(data.node.path);
    return cloneState({expandedPaths});
  }

  if (type === "NODE_PROPERTIES_LOADED") {
    // Let's loop through the responses to build a single object.
    const properties = mergeResponses(data.responses);

    return cloneState({
      actors: data.actor ? (new Set(state.actors || [])).add(data.actor) : state.actors,
      loadedProperties: (new Map(state.loadedProperties))
        .set(data.node.path, properties),
    });
  }

  if (type === "NODE_FOCUS") {
    return cloneState({
      focusedItem: data.node
    });
  }

  return state;
}

function mergeResponses(responses: Array<Object>) : Object {
  const data = {};

  for (const response of responses) {
    if (response.hasOwnProperty("ownProperties")) {
      data.ownProperties = Object.assign({}, data.ownProperties, response.ownProperties);
    }

    if (response.ownSymbols && response.ownSymbols.length > 0) {
      data.ownSymbols = response.ownSymbols;
    }

    if (response.prototype) {
      data.prototype = response.prototype;
    }
  }

  return data;
}

module.exports = reducer;
