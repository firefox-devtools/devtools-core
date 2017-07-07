/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  getURLDisplayString,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM document object.
 */
Document.propTypes = {
  object: React.PropTypes.object.isRequired,
};

function Document(props) {
  let grip = props.object;

  return (
    span({
      "data-link-actor-id": grip.actor,
      className: "objectBox objectBox-object"
    },
      getTitle(grip),
      span({className: "objectPropValue"},
        getLocation(grip)
      )
    )
  );
}

function getLocation(grip) {
  let location = grip.preview.location;
  return location ? getURLDisplayString(location) : "";
}

function getTitle(grip) {
  return span({
    className: "objectTitle",
  }, grip.class + " ");
}

// Registration
function supportsObject(object, type, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }

  return (object.preview && type == "HTMLDocument");
}

// Exports from this module
module.exports = {
  rep: wrapRender(Document),
  supportsObject,
};
