/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 // @flow
import type {
  GripProperties,
  ObjectClient,
  PropertiesIterator,
  RdpGrip,
} from "../types";

async function enumIndexedProperties(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownProperties?: Object}> {
  try {
    const {iterator} = await objectClient
      .enumProperties({ignoreNonIndexedProperties: true});
    const response = await iteratorSlice(iterator, start, end);
    return response;
  } catch (e) {
    console.error("Error in enumIndexedProperties", e);
    return {};
  }
}

async function enumNonIndexedProperties(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownProperties?: Object}> {
  try {
    const {iterator} = await objectClient.enumProperties({ignoreIndexedProperties: true});
    const response = await iteratorSlice(iterator, start, end);
    return response;
  } catch (e) {
    console.error("Error in enumNonIndexedProperties", e);
    return {};
  }
}

async function enumEntries(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownProperties?: Object}> {
  try {
    const {iterator} = await objectClient.enumEntries();
    const response = await iteratorSlice(iterator, start, end);
    return response;
  } catch (e) {
    console.error("Error in enumEntries", e);
    return {};
  }
}

async function enumSymbols(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownSymbols?: Array<Object>}> {
  try {
    const {iterator} = await objectClient.enumSymbols();
    const response = await iteratorSlice(iterator, start, end);
    return response;
  } catch (e) {
    console.error("Error in enumSymbols", e);
    return {};
  }
}

async function getPrototype(
  objectClient: ObjectClient
) : ?Promise<{prototype?: Object}> {
  if (typeof objectClient.getPrototype !== "function") {
    console.error("objectClient.getPrototype is not a function");
    return Promise.resolve({});
  }
  return objectClient.getPrototype();
}

async function getFullText(
  objectClient: ObjectClient,
  stringGrip: RdpGrip,
) : Promise<{ _fullText?: string }> {
  if (typeof objectClient.getString !== "function") {
    console.error("objectClient.getString is not a function");
    return Promise.resolve({});
  }

  return objectClient.getString(stringGrip);
}

function iteratorSlice(
  iterator: PropertiesIterator,
  start: ?number,
  end: ?number
) : Promise<GripProperties> {
  start = start || 0;
  const count = end
    ? end - start + 1
    : iterator.count;
  return iterator.slice(start, count);
}

module.exports = {
  enumEntries,
  enumIndexedProperties,
  enumNonIndexedProperties,
  enumSymbols,
  getPrototype,
  getFullText,
};
