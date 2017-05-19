/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a NaN object
 */
function NaNRep(props) {
  return (
    span({className: "objectBox objectBox-nan"},
      "NaN"
    )
  );
}

function supportsObject(object, type) {
  return type == "NaN";
}

// Exports from this module
module.exports = {
  rep: wrapRender(NaNRep),
  supportsObject,
};
