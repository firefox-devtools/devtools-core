/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  getURLDisplayString,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a grip object with URL data.
 */
ObjectWithURL.propTypes = {
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
};

function ObjectWithURL(props) {
  let grip = props.object;
  return (
    span({
      "data-link-actor-id": grip.actor,
      className: "objectBox objectBox-" + getType(grip)
    },
      getTitle(props, grip),
      span({className: "objectPropValue"}, getDescription(grip))
    )
  );
}

function getTitle(props, grip) {
  return safeObjectLink(props, {className: "objectBox"}, getType(grip) + " ");
}

function getType(grip) {
  return grip.class;
}

function getDescription(grip) {
  return getURLDisplayString(grip.preview.url);
}

// Registration
function supportsObject(grip, type, noGrip = false) {
  if (noGrip === true || !isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.preview.kind == "ObjectWithURL");
}

// Exports from this module
module.exports = {
  rep: wrapRender(ObjectWithURL),
  supportsObject,
};
