/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const constants = require("../constants");

function loadObjectProperties(object) {
  return async function ({ dispatch, client }) {
    const properties = await client.getProperties(object);

    // If the properties of the object had already been retrieved,
    // client.getProperties will return undefined.
    // Here we can have this kind of issue because we autoExpand the ObjectInspector,
    // and we have 3 times the same object represented (for all modes).
    // So all of the 3 ObjectInspector try to load the object properties at the same time.
    if (!properties) {
      return;
    }

    dispatch({
      type: constants.LOAD_PROPERTIES,
      object,
      value: {
        properties
      }
    });
  };
}

function loadObjectEntries(object) {
  return async function ({ dispatch, client }) {
    const entries = await client.getEntries(object);

    // If the entries of the object had already been retrieved,
    // client.getentries will return undefined.
    // Here we can have this kind of issue because we autoExpand the ObjectInspector,
    // and we have 3 times the same object represented (for all modes).
    // So all of the 3 ObjectInspector try to load the object entries at the same time.
    if (!entries) {
      return;
    }

    dispatch({
      type: constants.LOAD_ENTRIES,
      object,
      value: {
        actor: object.actor,
        entries,
      }
    });
  };
}

module.exports = {
  loadObjectEntries,
  loadObjectProperties,
};
