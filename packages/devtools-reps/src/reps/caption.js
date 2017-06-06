/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
const DOM = React.DOM;

const { wrapRender } = require("./rep-utils");

/**
 * Renders a caption. This template is used by other components
 * that needs to distinguish between a simple text/value and a label.
 */
Caption.propTypes = {
  object: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
};

function Caption(props) {
  return (
    DOM.span({"className": "caption"}, props.object)
  );
}

// Exports from this module
module.exports = wrapRender(Caption);
