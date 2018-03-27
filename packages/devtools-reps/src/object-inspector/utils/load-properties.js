/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  enumEntries,
  enumIndexedProperties,
  enumNonIndexedProperties,
  getPrototype,
  enumSymbols,
  getFullText,
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
  nodeIsLongString
} = require("./node");

import type {
  GripProperties,
  LoadedProperties,
  Node,
  ObjectClient,
  RdpGrip,
} from "../types";

function loadItemProperties(
  item : Node,
  createObjectClient : (RdpGrip) => ObjectClient,
  loadedProperties : LoadedProperties,
  createLongStringClient : (RdpGrip) => LongStringClient
) : Promise<GripProperties> {
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

  if (shouldLoadFullText(item, loadedProperties)) {
    promises.push(getFullText(getObjectClient(), item));
  }

  return Promise.all(promises).then(mergeResponses);
}

function mergeResponses(responses: Array<Object>) : Object {
  const data = {};

  for (const response of responses) {
    if (response.hasOwnProperty("ownProperties")) {
      data.ownProperties = {...data.ownProperties, ...response.ownProperties};
    }

    if (response.ownSymbols && response.ownSymbols.length > 0) {
      data.ownSymbols = response.ownSymbols;
    }

    if (response.prototype) {
      data.prototype = response.prototype;
    }

    if (response._fullText) {
      data.fullText = response._fullText;
    }
  }

  return data;
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

function shouldLoadFullText(item: Node, loadedProperties: LoadedProperties = new Map()) {
  const value = getValue(item);

  return value
    && !loadedProperties.has(item.path)
    && nodeIsLongString(item);
}

module.exports = {
  loadItemProperties,
  mergeResponses,
  shouldLoadItemEntries,
  shouldLoadItemIndexedProperties,
  shouldLoadItemNonIndexedProperties,
  shouldLoadItemPrototype,
  shouldLoadItemSymbols,
  shouldLoadFullText
};
