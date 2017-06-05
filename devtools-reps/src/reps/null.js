/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders null value
 */
function Null(props) {
  return (
    span({className: "objectBox objectBox-null"},
      "null"
    )
  );
}

function supportsObject(object, type) {
  if (object && object.type && object.type == "null") {
    return true;
  }

  return (object == null);
}

// Exports from this module

module.exports = {
  rep: wrapRender(Null),
  supportsObject,
};
