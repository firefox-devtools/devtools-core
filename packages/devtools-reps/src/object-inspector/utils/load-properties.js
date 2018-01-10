/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  enumEntries,
  enumIndexedProperties,
  enumNonIndexedProperties,
  getPrototype,
  enumSymbols,
} = require("./client");

const {
  getClosestGripNode,
  getClosestNonBucketNode,
  getValue,
  nodeHasAccessors,
  nodeHasAllEntriesInPreview,
  nodeHasProperties,
  nodeIsBucket,
  nodeIsDefaultProperties,
  nodeIsEntries,
  nodeIsMapEntry,
  nodeIsPrimitive,
  nodeIsProxy,
  nodeNeedsNumericalBuckets,
} = require("./node");

import type {
  GripProperties,
  LoadedProperties,
  Node,
  NodeContents,
  ObjectClient,
  RdpGrip,
} from "../types";

function loadItemProperties(
  item: Node,
  createObjectClient: (RdpGrip | NodeContents) => ObjectClient,
  loadedProperties: LoadedProperties
) : Promise<GripProperties> | null {
  const [start, end] = item.meta
    ? [item.meta.startIndex, item.meta.endIndex]
    : [];

  let objectClient;
  const getObjectClient = () => {
    if (objectClient) {
      return objectClient;
    }

    const gripItem = getClosestGripNode(item);
    const value = getValue(gripItem);
    return createObjectClient(value);
  };

  let loadingPromises = [];
  if (shouldLoadItemIndexedProperties(item, loadedProperties)) {
    loadingPromises.push(enumIndexedProperties(getObjectClient(), start, end));
  }

  if (shouldLoadItemNonIndexedProperties(item, loadedProperties)) {
    loadingPromises.push(enumNonIndexedProperties(getObjectClient(), start, end));
  }

  if (shouldLoadItemEntries(item, loadedProperties)) {
    loadingPromises.push(enumEntries(getObjectClient(), start, end));
  }

  if (shouldLoadItemPrototype(item, loadedProperties)) {
    loadingPromises.push(getPrototype(getObjectClient()));
  }

  if (shouldLoadItemSymbols(item, loadedProperties)) {
    loadingPromises.push(enumSymbols(getObjectClient(), start, end));
  }

  if (loadingPromises.length === 0) {
    return null;
  }

  return Promise.all(loadingPromises)
    .then(responses => responses.reduce((accumulator, res) => {
      // Let's loop through the responses to build a single response object.
      Object.entries(res).forEach(([k, v]) => {
        if (accumulator.hasOwnProperty(k)) {
          if (Array.isArray(accumulator[k])) {
            accumulator[k].push(...v);
          } else if (typeof accumulator[k] === "object") {
            accumulator[k] = Object.assign({}, accumulator[k], v);
          }
        } else {
          accumulator[k] = v;
        }
      });
      return accumulator;
    }, {}));
}

function shouldLoadItemIndexedProperties(
  item: Node,
  loadedProperties: LoadedProperties = new Map()
) : boolean {
  const gripItem = getClosestGripNode(item);
  const value = getValue(gripItem);

  return value
    && nodeHasProperties(gripItem)
    && !loadedProperties.has(item.path)
    && !nodeIsProxy(item)
    && !nodeNeedsNumericalBuckets(item)
    && !nodeIsEntries(getClosestNonBucketNode(item))
    // The data is loaded when expanding the window node.
    && !nodeIsDefaultProperties(item);
}

function shouldLoadItemNonIndexedProperties(
  item: Node,
  loadedProperties: LoadedProperties = new Map()
) : boolean {
  const gripItem = getClosestGripNode(item);
  const value = getValue(gripItem);

  return value
    && nodeHasProperties(gripItem)
    && !loadedProperties.has(item.path)
    && !nodeIsProxy(item)
    && !nodeIsEntries(getClosestNonBucketNode(item))
    && !nodeIsBucket(item)
    // The data is loaded when expanding the window node.
    && !nodeIsDefaultProperties(item);
}

function shouldLoadItemEntries(
  item: Node,
  loadedProperties: LoadedProperties = new Map()
) : boolean {
  const gripItem = getClosestGripNode(item);
  const value = getValue(gripItem);

  return value
    && nodeIsEntries(getClosestNonBucketNode(item))
    && !nodeHasAllEntriesInPreview(gripItem)
    && !loadedProperties.has(item.path)
    && !nodeNeedsNumericalBuckets(item);
}

function shouldLoadItemPrototype(
  item: Node,
  loadedProperties: LoadedProperties = new Map()
) : boolean {
  const value = getValue(item);

  return value
    && !loadedProperties.has(item.path)
    && !nodeIsBucket(item)
    && !nodeIsMapEntry(item)
    && !nodeIsEntries(item)
    && !nodeIsDefaultProperties(item)
    && !nodeHasAccessors(item)
    && !nodeIsPrimitive(item);
}

function shouldLoadItemSymbols(
  item: Node,
  loadedProperties: LoadedProperties = new Map()
) : boolean {
  const value = getValue(item);

  return value
    && !loadedProperties.has(item.path)
    && !nodeIsBucket(item)
    && !nodeIsMapEntry(item)
    && !nodeIsEntries(item)
    && !nodeIsDefaultProperties(item)
    && !nodeHasAccessors(item)
    && !nodeIsPrimitive(item)
    && !nodeIsProxy(item);
}

module.exports = {
  loadItemProperties,
  shouldLoadItemEntries,
  shouldLoadItemIndexedProperties,
  shouldLoadItemNonIndexedProperties,
  shouldLoadItemPrototype,
  shouldLoadItemSymbols,
};
