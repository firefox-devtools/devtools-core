/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies

const {
  isGrip,
  wrapRender,
} = require("./rep-utils");
const {
  getElementConfig,
  getFormattedText,
  stringPropTypes
} = require("./string");

const dom = require("react-dom-factories");
const { span } = dom;

/**
 * Renders a long string grip.
 */
LongStringRep.propTypes = stringPropTypes;

function LongStringRep(props) {
  let {
    cropLimit,
    member,
    object,
    style,
    useQuotes = true,
    escapeWhitespace = true,
  } = props;
  let {
    fullText,
    initial,
    length
  } = object;

  let config = Object.assign({
    "data-link-actor-id": object.actor,
  }, getElementConfig({ style }));

  let text = member && member.open
    ? fullText || initial
    : initial.substring(0, cropLimit);

  if (text.length < length) {
    text += "\u2026";
  }

  const formattedText = getFormattedText({
    useQuotes,
    escapeWhitespace
  }, text);
  return span(config, formattedText);
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
