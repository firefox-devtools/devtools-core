/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import type {
  GripProperties,
  LoadedProperties,
  Node,
  ObjectClient,
  RdpGrip,
  ReduxAction,
} from "./types";

const {
  loadItemProperties,
} = require("./utils/load-properties");

type Dispatch = ReduxAction => void;

type ThunkArg = {
  getState: () => {},
  dispatch: Dispatch,
}

/**
 * This action is responsible for expanding a given node,
 * which also means that it will call the action responsible to fetch properties.
 */
function nodeExpand(
  node : Node,
  actor?: string,
  loadedProperties : LoadedProperties,
  createObjectClient : (RdpGrip) => ObjectClient
) {
  return async ({dispatch} : ThunkArg) => {
    dispatch({
      type: "NODE_EXPAND",
      data: {node}
    });
    dispatch(nodeLoadProperties(node, actor, loadedProperties, createObjectClient));
  };
}

function nodeCollapse(node : Node) {
  return {
    type: "NODE_COLLAPSE",
    data: {node}
  };
}

function nodeFocus(node : Node) {
  return {
    type: "NODE_FOCUS",
    data: {node}
  };
}
/*
 * This action checks if we need to fetch properties, entries, prototype and symbols
 * for a given node. If we do, it will call the appropriate ObjectClient functions.
 */
function nodeLoadProperties(
  item : Node,
  actor?: string,
  loadedProperties : LoadedProperties,
  createObjectClient : (RdpGrip) => ObjectClient
) {
  return async ({dispatch} : ThunkArg) => {
    try {
      const properties =
        await loadItemProperties(item, createObjectClient, loadedProperties);
      if (Object.keys(properties).length > 0) {
        dispatch(nodePropertiesLoaded(item, actor, properties));
      }
    } catch (e) {
      console.error(e);
    }
  };
}

function nodePropertiesLoaded(
  node : Node,
  actor?: string,
  properties: GripProperties
) {
  return {
    type: "NODE_PROPERTIES_LOADED",
    data: {node, actor, properties}
  };
}

module.exports = {
  nodeExpand,
  nodeCollapse,
  nodeFocus,
  nodeLoadProperties,
  nodePropertiesLoaded,
};
