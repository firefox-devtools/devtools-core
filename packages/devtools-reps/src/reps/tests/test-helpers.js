/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { getGripPreviewItems } = require("../rep-utils");
const nodeConstants = require("../../shared/dom-node-constants");

/**
 * Get an array of all the items from the grip in parameter (including the grip itself)
 * which can be selected in the inspector.
 *
 * @param {Object} Grip
 * @return {Array} Flat array of the grips which can be selected in the inspector
 */
function getSelectableInInspectorGrips(grip) {
  let grips = new Set(getFlattenedGrips([grip]));
  return [...grips].filter(isGripSelectableInInspector);
}

/**
 * Indicate if a Grip can be selected in the inspector,
 * i.e. if it represents a node element.
 *
 * @param {Object} Grip
 * @return {Boolean}
 */
function isGripSelectableInInspector(grip) {
  return grip
    && typeof grip === "object"
    && grip.preview
    && [
      nodeConstants.TEXT_NODE,
      nodeConstants.ELEMENT_NODE
    ].includes(grip.preview.nodeType);
}

/**
 * Get a flat array of all the grips and their preview items.
 *
 * @param {Array} Grips
 * @return {Array} Flat array of the grips and their preview items
 */
function getFlattenedGrips(grips) {
  return grips.reduce((res, grip) => {
    let previewItems = getGripPreviewItems(grip);
    let flatPreviewItems = previewItems.length > 0
      ? getFlattenedGrips(previewItems)
      : [];

    return [...res, grip, ...flatPreviewItems];
  }, []);
}

module.exports = { getSelectableInInspectorGrips };
