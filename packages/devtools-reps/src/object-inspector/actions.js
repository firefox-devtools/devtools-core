/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import type {
  LoadedProperties,
  Node,
  ObjectClient,
  RdpGrip,
  ReduxAction,
} from "./types";

type Dispatch = ReduxAction => void;

type ThunkArg = {
  getState: () => {},
  dispatch: Dispatch,
}

const {
  getClosestGripNode,
  getValue,
} = require("./utils/node");

const {
  shouldLoadItemEntries,
  shouldLoadItemIndexedProperties,
  shouldLoadItemNonIndexedProperties,
  shouldLoadItemPrototype,
  shouldLoadItemSymbols,
} = require("./utils/load-properties");

const {
  enumEntries,
  enumIndexedProperties,
  enumNonIndexedProperties,
  getPrototype,
  enumSymbols,
} = require("./utils/client");

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
      const gripItem = getClosestGripNode(item);
      const value = getValue(gripItem);

      const [start, end] = item.meta
        ? [item.meta.startIndex, item.meta.endIndex]
        : [];

      let promises = [];
      let objectClient;
      const getObjectClient = () => objectClient || createObjectClient(value);

      if (shouldLoadItemIndexedProperties(item, loadedProperties)) {
        promises.push(enumIndexedProperties(getObjectClient(), start, end));
      }

      if (shouldLoadItemNonIndexedProperties(item, loadedProperties)) {
        promises.push(enumNonIndexedProperties(getObjectClient(), start, end));
      }

      if (shouldLoadItemEntries(item, loadedProperties)) {
        promises.push(enumEntries(getObjectClient(), start, end));
      }

      if (shouldLoadItemPrototype(item, loadedProperties)) {
        promises.push(getPrototype(getObjectClient()));
      }

      if (shouldLoadItemSymbols(item, loadedProperties)) {
        promises.push(enumSymbols(getObjectClient(), start, end));
      }

      if (promises.length > 0) {
        const responses = await Promise.all(promises);
        dispatch(nodePropertiesLoaded(item, actor, responses));
      }
    } catch (e) {
      console.error(e);
    }
  };
}

function nodePropertiesLoaded(
  node : Node,
  actor?: string,
  responses : Array<LoadedProperties>
) {
  return {
    type: "NODE_PROPERTIES_LOADED",
    data: {node, actor, responses}
  };
}

module.exports = {
  nodeExpand,
  nodeCollapse,
  nodeFocus,
  nodeLoadProperties,
  nodePropertiesLoaded,
};
