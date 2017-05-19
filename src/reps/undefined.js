/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders undefined value
 */
const Undefined = function () {
  return (
    span({className: "objectBox objectBox-undefined"},
      "undefined"
    )
  );
};

function supportsObject(object, type) {
  if (object && object.type && object.type == "undefined") {
    return true;
  }

  return (type == "undefined");
}

// Exports from this module

module.exports = {
  rep: wrapRender(Undefined),
  supportsObject,
};
