/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const PropTypes = require("prop-types");

const {
  containsURL,
  isURL,
  escapeString,
  getGripType,
  rawCropString,
  sanitizeString,
  wrapRender,
  tokenSplitRegex,
  ELLIPSIS,
} = require("./rep-utils");

const dom = require("react-dom-factories");
const { a, span } = dom;

const stringPropTypes = {
  useQuotes: PropTypes.bool,
  escapeWhitespace: PropTypes.bool,
  style: PropTypes.object,
  cropLimit: PropTypes.number.isRequired,
  member: PropTypes.string,
  object: PropTypes.object.isRequired
};

/**
 * Renders a string. String value is enclosed within quotes.
 */
StringRep.propTypes = {
  ...stringPropTypes,
  openLink: PropTypes.func,
  className: PropTypes.string,
  omitLinkHref: PropTypes.bool,
};

function StringRep(props) {
  let {
    className,
    style,
    cropLimit,
    object: text,
    useQuotes = true,
    escapeWhitespace = true,
    member,
    openLink,
    omitLinkHref = true,
  } = props;

  const config = getElementConfig({
    className,
    style
  });

  text = getFormattedText({
    useQuotes,
    escapeWhitespace
  }, text);

  const shouldCrop = (!member || !member.open) && cropLimit && text.length > cropLimit;

  if (!containsURL(text)) {
    if (shouldCrop) {
      text = rawCropString(text, cropLimit);
    }
    return span(config, text);
  }

  return span(config,
    ...getLinkifiedElements(text, shouldCrop && cropLimit, omitLinkHref, openLink));
}

function getFormattedText(opts, text) {
  let {
    useQuotes,
    escapeWhitespace
  } = opts;

  if (useQuotes) {
    text = escapeString(text, escapeWhitespace);
  } else {
    text = sanitizeString(text);
  }

  return text;
}

function getElementConfig(config) {
  let {
    className,
    style
  } = config;

  const classNames = ["objectBox", "objectBox-string"];
  if (className) {
    classNames.push(className);
  }
  config.className = classNames.join(" ");

  if (!style) {
    delete config.style;
  }

  return config;
}

/**
 * Get an array of the elements representing the string, cropped if needed,
 * with actual links.
 *
 * @param {String} text: The actual string to linkify.
 * @param {Integer | null} cropLimit
 * @param {Boolean} omitLinkHref: Do not create an href attribute if true.
 * @param {Function} openLink: Function handling the link opening.
 * @returns {Array<String|ReactElement>}
 */
function getLinkifiedElements(text, cropLimit, omitLinkHref, openLink) {
  const halfLimit = Math.ceil((cropLimit - ELLIPSIS.length) / 2);
  const startCropIndex = cropLimit ? halfLimit : null;
  const endCropIndex = cropLimit ? text.length - halfLimit : null;

  // As we walk through the tokens of the source string, we make sure to preserve
  // the original whitespace that separated the tokens.
  let currentIndex = 0;
  const items = [];
  for (let token of text.split(tokenSplitRegex)) {
    if (isURL(token)) {
      // Let's grab all the non-url strings before the link.
      const tokenStart = text.indexOf(token, currentIndex);
      let nonUrlText = text.slice(currentIndex, tokenStart);
      nonUrlText = getCroppedString(
          nonUrlText, currentIndex, startCropIndex, endCropIndex);
      if (nonUrlText) {
        items.push(nonUrlText);
      }

      // Update the index to match the beginning of the token.
      currentIndex = tokenStart;

      let linkText = getCroppedString(token, currentIndex, startCropIndex, endCropIndex);
      if (linkText) {
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
        }, linkText));
      }

      currentIndex = tokenStart + token.length;
    }
  }

  // Clean up any non-URL text at the end of the source string,
  // i.e. not handled in the loop.
  if (currentIndex !== text.length) {
    let nonUrlText = text.slice(currentIndex, text.length);
    if (currentIndex < endCropIndex) {
      const cutIndex = endCropIndex - currentIndex;
      nonUrlText = nonUrlText.substring(cutIndex);
    }
    items.push(nonUrlText);
  }

  return items;
}

/**
 * Returns a cropped substring given an offset, start and end crop indices in a parent
 * string.
 *
 * @param {String} text: The substring to crop.
 * @param {Integer} offset: The offset corresponding to the index at which the substring
 *                          is in the parent string.
 * @param {Integer|null} startCropIndex: the index where the start of the crop should
 *                                       happen in the parent string.
 * @param {Integer|null} endCropIndex: the index where the end of the crop should happen
 *                                     in the parent string
 * @returns {String|null} The cropped substring, or null if the text is completly cropped.
 */
function getCroppedString(text, offset = 0, startCropIndex, endCropIndex) {
  if (!startCropIndex) {
    return text;
  }

  const start = offset;
  const end = offset + text.length;

  const shouldBeVisible = !(start >= startCropIndex && end <= endCropIndex);
  if (!shouldBeVisible) {
    return null;
  }

  const shouldCropEnd = start < startCropIndex && end > startCropIndex;
  const shouldCropStart = start < endCropIndex && end > endCropIndex;
  if (shouldCropEnd) {
    const cutIndex = startCropIndex - start;
    return text.substring(0, cutIndex) +
      ELLIPSIS +
      (shouldCropStart ? text.substring(endCropIndex - start) : "");
  }

  if (shouldCropStart) {
    // The string should be cropped at the beginning.
    const cutIndex = endCropIndex - start;
    return text.substring(cutIndex);
  }

  return text;
}

function supportsObject(object, noGrip = false) {
  return getGripType(object, noGrip) == "string";
}

// Exports from this module

module.exports = {
  rep: wrapRender(StringRep),
  supportsObject,
  getElementConfig,
  getFormattedText,
  stringPropTypes
};
