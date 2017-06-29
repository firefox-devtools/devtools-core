/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");

/**
 * Renders a grip object with regular expression.
 */
RegExp.propTypes = {
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
};

function RegExp(props) {
  let {object} = props;

  return (
    safeObjectLink(props, {
      "data-link-actor-id": object.actor,
      className: "objectBox objectBox-regexp regexpSource"
    }, getSource(object))
  );
}

function getSource(grip) {
  return grip.displayString;
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }

  return (type == "RegExp");
}

// Exports from this module
module.exports = {
  rep: wrapRender(RegExp),
  supportsObject,
};
