/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
const {
  escapeString,
  sanitizeString,
  isGrip,
  wrapRender,
} = require("./rep-utils");
// Shortcuts
const { span } = React.DOM;

/**
 * Renders a long string grip.
 */
LongStringRep.propTypes = {
  useQuotes: React.PropTypes.bool,
  escapeWhitespace: React.PropTypes.bool,
  style: React.PropTypes.object,
  cropLimit: React.PropTypes.number.isRequired,
  member: React.PropTypes.string,
  object: React.PropTypes.object.isRequired,
};

function LongStringRep(props) {
  let {
    cropLimit,
    member,
    object,
    style,
    useQuotes = true,
    escapeWhitespace = true,
  } = props;
  let {fullText, initial, length} = object;

  let config = {
    "data-link-actor-id": object.actor,
    className: "objectBox objectBox-string"
  };

  if (style) {
    config.style = style;
  }

  let string = member && member.open
    ? fullText || initial
    : initial.substring(0, cropLimit);

  if (string.length < length) {
    string += "\u2026";
  }
  let formattedString = useQuotes ? escapeString(string, escapeWhitespace) :
      sanitizeString(string);
  return span(config, formattedString);
}

function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return object.type === "longString";
}

// Exports from this module
module.exports = {
  rep: wrapRender(LongStringRep),
  supportsObject,
};
