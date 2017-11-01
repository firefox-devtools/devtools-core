/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const PropTypes = require("prop-types");
const {
  escapeString,
  sanitizeString,
  isGrip,
  wrapRender,
} = require("./rep-utils");

const dom = require("react-dom-factories");
const { span } = dom;

/**
 * Renders a long string grip.
 */
LongStringRep.propTypes = {
  useQuotes: PropTypes.bool,
  escapeWhitespace: PropTypes.bool,
  style: PropTypes.object,
  cropLimit: PropTypes.number.isRequired,
  member: PropTypes.string,
  object: PropTypes.object.isRequired,
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

function supportsObject(object, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }
  return object.type === "longString";
}

// Exports from this module
module.exports = {
  rep: wrapRender(LongStringRep),
  supportsObject,
};
