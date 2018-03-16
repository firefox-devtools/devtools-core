/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

const {WAIT_UNTIL_TYPE} = require("../../shared/redux/middleware/waitUntilService");

/*
 * Takes an Enzyme wrapper (obtained with mount/shallow/…) and
 * returns a stringified version of the ObjectInspector, e.g.
 *
 *   ▼ Map { Symbol(a) → "value-a", Symbol(b) → "value-b" }
 *   |    size : 2
 *   |  ▼ <entries>
 *   |  |  ▼ 0 : Symbol(a) → "value-a"
 *   |  |  |    <key> : Symbol(a)
 *   |  |  |    <value> : "value-a"
 *   |  |  ▼ 1 : Symbol(b) → "value-b"
 *   |  |  |    <key> : Symbol(b)
 *   |  |  |    <value> : "value-b"
 *   |  ▼ <prototype> : Object { … }
 *
 */
function formatObjectInspector(wrapper: Object) {
  return wrapper.find(".tree-node")
    .map(node => {
      const indentStr = "|  ".repeat((node.prop("aria-level") || 1) - 1);
      // Need to target img.arrow or Enzyme will also match the ArrowExpander component.
      const arrow = node.find("img.arrow");
      let arrowStr = "  ";
      if (arrow.exists()) {
        arrowStr = arrow.hasClass("expanded") ? "▼ " : "▶︎ ";
      } else {
        arrowStr = "  ";
      }

      const icon = node.find(".node").first().hasClass("block")
        ? "☲ "
        : "";
      return `${indentStr}${arrowStr}${icon}${getSanitizedNodeText(node)}`;
    })
    .join("\n");
}

function getSanitizedNodeText(node) {
  // Stripping off the invisible space used in the indent.
  return node.text().replace(/^\u200B+/, "");
}

/**
 * Wait for a specific action type to be dispatched.
 *
 * @param {Object} store: Redux store
 * @param {String} type: type of the actin to wait for
 * @return {Promise}
 */
function waitForDispatch(store: Object, type: string) {
  return new Promise(resolve => {
    store.dispatch({
      type: WAIT_UNTIL_TYPE,
      predicate: action => action.type === type,
      run: (dispatch, getState, action) => {
        resolve(action);
      }
    });
  });
}

module.exports = {
  formatObjectInspector,
  waitForDispatch,
};
