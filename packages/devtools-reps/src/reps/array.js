/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
const {
  wrapRender,
} = require("./rep-utils");
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
    if (isEmpty) {
      items = [];
    } else {
      items = [DOM.span({
        className: "more-ellipsis",
        title: "more…"
      }, "…")];
    }
    brackets = needSpace(false);
  } else {
    items = arrayIterator(props, object, maxLengthMap.get(mode));
    brackets = needSpace(items.length > 0);
  }

  return (
    DOM.span({
      className: "objectBox objectBox-array"},
      DOM.span({
        className: "arrayLeftBracket",
      }, brackets.left),
      ...items,
      DOM.span({
        className: "arrayRightBracket",
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

  for (let i = 0; i < array.length && i < max; i++) {
    let config = {
      mode: MODE.TINY,
      delim: (i == array.length - 1 ? "" : ", ")
    };
    let item;

    try {
      item = ItemRep(Object.assign({}, props, config, {
        object: array[i],
      }));
    } catch (exc) {
      item = ItemRep(Object.assign({}, props, config, {
        object: exc,
      }));
    }
    items.push(item);
  }

  if (array.length > max) {
    items.push(DOM.span({
      className: "more-ellipsis",
      title: "more…"
    }, "…"));
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
      Rep(Object.assign({}, props, {
        object: object,
        mode: mode
      })),
      delim
    )
  );
}

function getLength(object) {
  return object.length;
}

function supportsObject(object) {
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
  getLength,
};
