/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");

const {
  containsURL,
  isURL,
  escapeString,
  getGripType,
  rawCropString,
  sanitizeString,
  wrapRender,
  tokenSplitRegex,
} = require("./rep-utils");

// Shortcuts
const { a, span } = React.DOM;

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
  openLink: React.PropTypes.func,
  omitLinkHref: React.PropTypes.bool,
};

function StringRep(props) {
  let {
    cropLimit,
    object: text,
    member,
    style,
    useQuotes = true,
    escapeWhitespace = true,
    openLink,
    omitLinkHref = true,
  } = props;

  let config = {className: "objectBox objectBox-string"};
  if (style) {
    config.style = style;
  }

  if (useQuotes) {
    text = escapeString(text, escapeWhitespace);
  } else {
    text = sanitizeString(text);
  }

  if ((!member || !member.open) && cropLimit) {
    text = rawCropString(text, cropLimit);
  }

  if (!containsURL(text)) {
    return span(config, text);
  }

  const items = [];

  // As we walk through the tokens of the source string, we make sure to preserve
  // the original whitespace that separated the tokens.
  let tokens = text.split(tokenSplitRegex);
  let textIndex = 0;
  let tokenStart;
  tokens.forEach((token, i) => {
    tokenStart = text.indexOf(token, textIndex);
    if (isURL(token)) {
      items.push(text.slice(textIndex, tokenStart));
      textIndex = tokenStart + token.length;

      items.push(a({
        className: "url",
        title: token,
        href: omitLinkHref === true
          ? null
          : token,
        draggable: false,
        onClick: openLink
          ? e => {
            e.preventDefault();
            openLink(token);
          }
          : null
      }, token));
    }
  });

  // Clean up any non-URL text at the end of the source string.
  items.push(text.slice(textIndex, text.length));
  return span(config, ...items);
}

function supportsObject(object, noGrip = false) {
  return getGripType(object, noGrip) == "string";
}

// Exports from this module

module.exports = {
  rep: wrapRender(StringRep),
  supportsObject,
};
