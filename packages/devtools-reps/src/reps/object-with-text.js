/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const PropTypes = require("prop-types");
const { span } = require("react-dom-factories");

// Reps
const {
  isGrip,
  wrapRender,
} = require("./rep-utils");

/**
 * Renders a grip object with textual data.
 */
ObjectWithText.propTypes = {
  object: PropTypes.object.isRequired,
};

function ObjectWithText(props) {
  let grip = props.object;
  return (
    span({
      "data-link-actor-id": grip.actor,
      className: "objectBox objectBox-" + getType(grip)
    },
      span({className: "objectPropValue"}, getDescription(grip))
    )
  );
}

function getType(grip) {
  return grip.class;
}

function getDescription(grip) {
  return "\"" + grip.preview.text + "\"";
}

// Registration
function supportsObject(grip, noGrip = false) {
  if (noGrip === true || !isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.preview.kind == "ObjectWithText");
}

// Exports from this module
module.exports = {
  rep: wrapRender(ObjectWithText),
  supportsObject,
};
