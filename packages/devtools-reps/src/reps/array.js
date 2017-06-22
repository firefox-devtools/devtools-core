/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
const {
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const Caption = require("./caption");
const { MODE } = require("./constants");

const ModePropType = React.PropTypes.oneOf(
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  Object.keys(MODE).map(key => MODE[key])
);

// Shortcuts
const DOM = React.DOM;

/**
 * Renders an array. The array is enclosed by left and right bracket
 * and the max number of rendered items depends on the current mode.
 */
ArrayRep.propTypes = {
  mode: ModePropType,
  objectLink: React.PropTypes.func,
  object: React.PropTypes.array.isRequired,
};

function ArrayRep(props) {
  let {
    object,
    mode = MODE.SHORT,
  } = props;

  let items;
  let brackets;
  let needSpace = function (space) {
    return space ? { left: "[ ", right: " ]"} : { left: "[", right: "]"};
  };

  if (mode === MODE.TINY) {
    let isEmpty = object.length === 0;
    items = [DOM.span({className: "length"}, isEmpty ? "" : object.length)];
    brackets = needSpace(false);
  } else {
    items = arrayIterator(props, object, maxLengthMap.get(mode));
    brackets = needSpace(items.length > 0);
  }

  return (
    DOM.span({
      className: "objectBox objectBox-array"},
      safeObjectLink(props, {
        className: "arrayLeftBracket",
        object: object
      }, brackets.left),
      ...items,
      safeObjectLink(props, {
        className: "arrayRightBracket",
        object: object
      }, brackets.right),
      DOM.span({
        className: "arrayProperties",
        role: "group"}
      )
    )
  );
}

function arrayIterator(props, array, max) {
  let items = [];
  let delim;

  for (let i = 0; i < array.length && i < max; i++) {
    try {
      let value = array[i];

      delim = (i == array.length - 1 ? "" : ", ");

      items.push(ItemRep({
        object: value,
        // Hardcode tiny mode to avoid recursive handling.
        mode: MODE.TINY,
        delim: delim
      }));
    } catch (exc) {
      items.push(ItemRep({
        object: exc,
        mode: MODE.TINY,
        delim: delim
      }));
    }
  }

  if (array.length > max) {
    items.push(Caption({
      object: safeObjectLink(props, {
        object: props.object
      }, "more…")
    }));
  }

  return items;
}

/**
 * Renders array item. Individual values are separated by a comma.
 */
ItemRep.propTypes = {
  object: React.PropTypes.any.isRequired,
  delim: React.PropTypes.string.isRequired,
  mode: ModePropType,
};

function ItemRep(props) {
  const { Rep } = require("./rep");

  let {
    object,
    delim,
    mode,
  } = props;
  return (
    DOM.span({},
      Rep({object: object, mode: mode}),
      delim
    )
  );
}

function supportsObject(object, type) {
  return Array.isArray(object) ||
    Object.prototype.toString.call(object) === "[object Arguments]";
}

const maxLengthMap = new Map();
maxLengthMap.set(MODE.SHORT, 3);
maxLengthMap.set(MODE.LONG, 10);

// Exports from this module
module.exports = {
  rep: wrapRender(ArrayRep),
  supportsObject,
  maxLengthMap,
};
