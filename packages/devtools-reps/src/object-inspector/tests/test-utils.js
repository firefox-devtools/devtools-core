/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
 *   |  ▼ __proto__ : Object { … }
 *
 */
function formatObjectInspector(wrapper) {
  return wrapper.find(".node")
    .map(node => {
      const indentStr = "|  ".repeat(node.prop("data-depth") || 0);
      const arrow = node.find(".arrow");
      let arrowStr = "  ";
      if (arrow.exists()) {
        arrowStr = arrow.hasClass("expanded") ? "▼ " : "▶︎ ";
      } else {
        arrowStr = "  ";
      }
      return `${indentStr}${arrowStr}${node.text()}`;
    })
    .join("\n");
}

module.exports = {
  formatObjectInspector
};
