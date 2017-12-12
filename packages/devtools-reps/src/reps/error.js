/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const PropTypes = require("prop-types");
// Utils
const {
  getGripType,
  isGrip,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");

const dom = require("react-dom-factories");
const { span } = dom;

/**
 * Renders Error objects.
 */
ErrorRep.propTypes = {
  object: PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
};

function ErrorRep(props) {
  let object = props.object;
  let preview = object.preview;

  let name;
  if (preview && preview.name && preview.kind) {
    switch (preview.kind) {
      case "Error":
        name = preview.name;
        break;
      case "DOMException":
        name = preview.kind;
        break;
      default:
        throw new Error("Unknown preview kind for the Error rep.");
    }
  } else {
    name = "Error";
  }

  let content = props.mode === MODE.TINY
    ? name
    : `${name}: ${preview.message}`;

  if (preview.stack && props.mode !== MODE.TINY) {
    /*
      * Since Reps are used in the JSON Viewer, we can't localize
      * the "Stack trace" label (defined in debugger.properties as
      * "variablesViewErrorStacktrace" property), until Bug 1317038 lands.
      */
    content = `${content}\nStack trace:\n${preview.stack}`;
  }

  return span({
    "data-link-actor-id": object.actor,
    className: "objectBox-stackTrace"
  }, content);
}

// Registration
function supportsObject(object, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }
  return (
    object.preview &&
    getGripType(object, noGrip) === "Error" ||
    object.class === "DOMException"
  );
}

// Exports from this module
module.exports = {
  rep: wrapRender(ErrorRep),
  supportsObject,
};
