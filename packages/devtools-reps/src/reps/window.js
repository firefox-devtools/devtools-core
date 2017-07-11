/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  getURLDisplayString,
  wrapRender
} = require("./rep-utils");

const { MODE } = require("./constants");

// Shortcuts
const {span} = React.DOM;

/**
 * Renders a grip representing a window.
 */
WindowRep.propTypes = {
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  object: React.PropTypes.object.isRequired,
};

function WindowRep(props) {
  let {
    mode,
    object,
  } = props;

  const config = {
    "data-link-actor-id": object.actor,
    className: "objectBox objectBox-Window",
  };

  if (mode === MODE.TINY) {
    return (
      span(config, getTitle(object))
    );
  }

  return (
    span(config,
      getTitle(object),
      " ",
      span({className: "objectPropValue"},
        getLocation(object)
      )
    )
  );
}

function getTitle(object) {
  let title = object.displayClass || object.class || "Window";
  return span({className: "objectBoxTitle"}, title);
}

function getLocation(object) {
  return getURLDisplayString(object.preview.url);
}

// Registration
function supportsObject(object, type, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }

  return (object.preview && type == "Window");
}

// Exports from this module
module.exports = {
  rep: wrapRender(WindowRep),
  supportsObject,
};
