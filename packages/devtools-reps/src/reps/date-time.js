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

// Shortcuts
const { span } = React.DOM;

/**
 * Used to render JS built-in Date() object.
 */
DateTime.propTypes = {
  object: React.PropTypes.object.isRequired,
};

function DateTime(props) {
  let grip = props.object;
  let date;
  try {
    date = span({
      "data-link-actor-id": grip.actor,
      className: "objectBox",
    },
      getTitle(grip),
      span({className: "Date"},
        new Date(grip.preview.timestamp).toISOString()
      )
    );
  } catch (e) {
    date = span({className: "objectBox"}, "Invalid Date");
  }

  return date;
}

function getTitle(grip) {
  return span({}, grip.class + " ");
}

// Registration
function supportsObject(grip, type, noGrip = false) {
  if (noGrip === true || !isGrip(grip)) {
    return false;
  }

  return (type == "Date" && grip.preview);
}

// Exports from this module
module.exports = {
  rep: wrapRender(DateTime),
  supportsObject,
};
