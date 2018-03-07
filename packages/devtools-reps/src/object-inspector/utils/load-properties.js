/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
  LoadedProperties,
  Node,
} from "../types";

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
  shouldLoadItemEntries,
  shouldLoadItemIndexedProperties,
  shouldLoadItemNonIndexedProperties,
  shouldLoadItemPrototype,
  shouldLoadItemSymbols,
};
