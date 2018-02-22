/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {ELEMENT_NODE} = require("../../shared/dom-node-constants");

function documentHasSelection() : boolean {
  const selection = getSelection();
  if (!selection) {
    return false;
  }

  const {
    anchorNode,
    focusNode,
  } = selection;

  // When clicking the arrow, which is an inline svg element, the selection do have a type
  // of "Range". We need to have an explicit case when the anchor and the focus node are
  // the same and they have an arrow ancestor.
  if (
    focusNode &&
    focusNode === anchorNode &&
    focusNode.nodeType == ELEMENT_NODE &&
    focusNode.closest(".arrow")
  ) {
    return false;
  }

  return selection.type === "Range";
}

module.exports = {
  documentHasSelection,
};
