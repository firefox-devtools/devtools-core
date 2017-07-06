/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  wrapRender,
} = require("./rep-utils");

const { MODE } = require("./constants");
const { rep } = require("./grip");

/**
 * Renders DOM event objects.
 */
Event.propTypes = {
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
};

function Event(props) {
  // Use `Object.assign` to keep `props` without changes because:
  // 1. JSON.stringify/JSON.parse is slow.
  // 2. Immutable.js is planned for the future.
  let gripProps = Object.assign({}, props, {
    title: getTitle(props)
  });
  gripProps.object = Object.assign({}, props.object);
  gripProps.object.preview = Object.assign({}, props.object.preview);

  gripProps.object.preview.ownProperties = {};
  if (gripProps.object.preview.target) {
    Object.assign(gripProps.object.preview.ownProperties, {
      target: gripProps.object.preview.target
    });
  }
  Object.assign(gripProps.object.preview.ownProperties,
    gripProps.object.preview.properties);

  delete gripProps.object.preview.properties;
  gripProps.object.ownPropertyLength =
    Object.keys(gripProps.object.preview.ownProperties).length;

  switch (gripProps.object.class) {
    case "MouseEvent":
      gripProps.isInterestingProp = (type, value, name) => {
        return ["target", "clientX", "clientY", "layerX", "layerY"].includes(name);
      };
      break;
    case "KeyboardEvent":
      gripProps.isInterestingProp = (type, value, name) => {
        return ["target", "key", "charCode", "keyCode"].includes(name);
      };
      break;
    case "MessageEvent":
      gripProps.isInterestingProp = (type, value, name) => {
        return ["target", "isTrusted", "data"].includes(name);
      };
      break;
    default:
      gripProps.isInterestingProp = (type, value, name) => {
        // We want to show the properties in the order they are declared.
        return Object.keys(gripProps.object.preview.ownProperties).includes(name);
      };
  }

  return rep(gripProps);
}

function getTitle(props) {
  let preview = props.object.preview;
  let title = preview.type;

  if (preview.eventKind == "key" && preview.modifiers && preview.modifiers.length) {
    title = `${title} ${preview.modifiers.join("-")}`;
  }
  return title;
}

// Registration
function supportsObject(grip, type, noGrip = false) {
  if (noGrip === true || !isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.preview.kind == "DOMEvent");
}

// Exports from this module
module.exports = {
  rep: wrapRender(Event),
  supportsObject,
};
