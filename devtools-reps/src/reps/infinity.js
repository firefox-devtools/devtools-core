/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a Infinity object
 */
InfinityRep.propTypes = {
  object: React.PropTypes.object.isRequired,
};

function InfinityRep(props) {
  return (
    span({className: "objectBox objectBox-number"},
      props.object.type
    )
  );
}

function supportsObject(object, type) {
  return type == "Infinity" || type == "-Infinity";
}

// Exports from this module
module.exports = {
  rep: wrapRender(InfinityRep),
  supportsObject,
};
