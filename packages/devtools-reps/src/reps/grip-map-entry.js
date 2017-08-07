/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
// Shortcuts
const { span } = React.DOM;
const {
  wrapRender,
} = require("./rep-utils");
const PropRep = require("./prop-rep");
const { MODE } = require("./constants");
/**
 * Renders an map entry. A map entry is represented by its key, a column and its value.
 */
GripMapEntry.propTypes = {
  object: React.PropTypes.object,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
};

function GripMapEntry(props) {
  const {
    object,
  } = props;

  const {
    key,
    value,
  } = object.preview;

  return span({
    className: "objectBox objectBox-map-entry"
  }, ...PropRep(Object.assign({}, props, {
    name: key,
    object: value,
    equal: " \u2192 ",
    title: null,
    suppressQuotes: false,
  })));
}

function supportsObject(grip, noGrip = false) {
  if (noGrip === true) {
    return false;
  }
  return (grip && grip.type === "mapEntry" && grip.preview);
}

function createGripMapEntry(key, value) {
  return {
    type: "mapEntry",
    preview: {
      key,
      value,
    }
  };
}

// Exports from this module
module.exports = {
  rep: wrapRender(GripMapEntry),
  createGripMapEntry,
  supportsObject,
};
