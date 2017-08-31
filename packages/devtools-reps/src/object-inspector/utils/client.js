/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 // @flow
import type {
  GripProperties,
  ObjectClient,
  PropertiesIterator,
} from "../types";

async function enumIndexedProperties(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownProperties: Object}> {
  const {iterator} = await objectClient
    .enumProperties({ignoreNonIndexedProperties: true});
  const response = await iteratorSlice(iterator, start, end);
  return response;
}

async function enumNonIndexedProperties(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownProperties: Object}> {
  const {iterator} = await objectClient.enumProperties({ignoreIndexedProperties: true});

  const response = await iteratorSlice(iterator, start, end);
  return response;
}

async function enumEntries(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownProperties: Object}> {
  const {iterator} = await objectClient.enumEntries();
  const response = await iteratorSlice(iterator, start, end);
  return response;
}

async function enumSymbols(
  objectClient: ObjectClient,
  start: ?number,
  end: ?number
) : Promise<{ownSymbols: Array<Object>}> {
  const {iterator} = await objectClient.enumSymbols();
  const response = await iteratorSlice(iterator, start, end);
  return response;
}

function getPrototype(
  objectClient: ObjectClient
) : ?Promise<{prototype: Object}> {
  return objectClient.getPrototype();
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
};
