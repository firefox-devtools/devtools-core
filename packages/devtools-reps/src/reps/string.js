/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");

const {
  escapeString,
  rawCropString,
  sanitizeString,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a string. String value is enclosed within quotes.
 */
StringRep.propTypes = {
  useQuotes: React.PropTypes.bool,
  escapeWhitespace: React.PropTypes.bool,
  style: React.PropTypes.object,
  object: React.PropTypes.string.isRequired,
  member: React.PropTypes.any,
  cropLimit: React.PropTypes.number,
};

function StringRep(props) {
  let {
    cropLimit,
    object: text,
    member,
    style,
    useQuotes = true,
    escapeWhitespace = true,
  } = props;

  let config = {className: "objectBox objectBox-string"};
  if (style) {
    config.style = style;
  }

  if (useQuotes || text === "") {
    text = escapeString(text, escapeWhitespace);
  } else {
    text = sanitizeString(text);
  }

  if ((!member || !member.open) && cropLimit) {
    text = rawCropString(text, cropLimit);
  }

  return span(config, text);
}

function supportsObject(object, type) {
  return (type == "string");
}

// Exports from this module

module.exports = {
  rep: wrapRender(StringRep),
  supportsObject,
};
