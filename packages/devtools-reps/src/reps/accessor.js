/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
const {
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
// Shortcuts
const {
  span,
} = React.DOM;
/**
 * Renders an object. An object is represented by a list of its
 * properties enclosed in curly brackets.
 */
Accessor.propTypes = {
  object: React.PropTypes.object.isRequired,
  mode: React.PropTypes.oneOf(Object.values(MODE)),
};

function Accessor(props) {
  const {
    object,
  } = props;

  const accessors = [];
  if (hasGetter(object)) {
    accessors.push("Getter");
  }
  if (hasSetter(object)) {
    accessors.push("Setter");
  }
  const title = accessors.join(" & ");

  return (
    span({className: "objectBox objectBox-accessor"},
      span({
        className: "objectTitle",
      }, title)
    )
  );
}

function hasGetter(object) {
  return object && object.get && object.get.type !== "undefined";
}

function hasSetter(object) {
  return object && object.set && object.set.type !== "undefined";
}

function supportsObject(object, type, noGrip = false) {
  if (noGrip !== true && (hasGetter(object) || hasSetter(object))) {
    return true;
  }

  return false;
}

// Exports from this module
module.exports = {
  rep: wrapRender(Accessor),
  supportsObject,
};
