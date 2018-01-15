/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const PropTypes = require("prop-types");
const {
  getGripType,
  isGrip,
  wrapRender,
  getMoreEllipsisElement
} = require("./rep-utils");
const { MODE } = require("./constants");

const dom = require("react-dom-factories");
const { span } = dom;
const { ModePropType } = require("./array");

/**
 * Renders an array. The array is enclosed by left and right bracket
 * and the max number of rendered items depends on the current mode.
 */
GripArray.propTypes = {
  object: PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: ModePropType,
  provider: PropTypes.object,
  onDOMNodeMouseOver: PropTypes.func,
  onDOMNodeMouseOut: PropTypes.func,
  onInspectIconClick: PropTypes.func,
};

function GripArray(props) {
  let {
    object,
    mode = MODE.SHORT
  } = props;

  let items;
  let brackets;
  let needSpace = function (space) {
    return space ? { left: "[ ", right: " ]"} : { left: "[", right: "]"};
  };

  if (mode === MODE.TINY) {
    const isEmpty = getLength(object) === 0;
    brackets = needSpace(false);

    return (
      span({
          "data-link-actor-id": object.actor,
          className: "objectBox objectBox-array"},
        getTitle(props, object),
        span({
          className: "arrayLeftBracket",
        }, brackets.left),
        isEmpty ? null : getMoreEllipsisElement(),
        span({
          className: "arrayRightBracket",
        }, brackets.right)
      )
    );
  }

  let max = maxLengthMap.get(mode);
  items = arrayIterator(props, object, max);
  brackets = needSpace(items.length > 0);

  return (
    span({
        "data-link-actor-id": object.actor,
        className: "objectBox objectBox-array"},
      getTitle(props, object),
      span({
        className: "arrayLeftBracket",
      }, brackets.left),
      ...interleaveCommas(items),
      span({
        className: "arrayRightBracket",
      }, brackets.right),
      span({
        className: "arrayProperties",
        role: "group"}
      )
    )
  );
}

function interleaveCommas(items) {
  return items.reduce((res, item, index) => {
    if (index !== items.length - 1) {
      return res.concat(item, ", ");
    }
    return res.concat(item);
  }, []);
}

function getLength(grip) {
  if (!grip.preview) {
    return 0;
  }

  return grip.preview.length || grip.preview.childNodesLength || 0;
}

GripLengthBubble.propTypes = {
  length: PropTypes.number.isRequired,
  mode: ModePropType,
  maxLengthByMode: PropTypes.instanceOf(Map),
  visibilityThreshold: PropTypes.number
};

function GripLengthBubble(props) {
  const {
    length,
    mode = MODE.SHORT,
    maxLengthByMode = maxLengthMap,
    visibilityThreshold = 5
  } = props;

  const isEmpty = length === 0;
  const isObvious = [MODE.SHORT, MODE.LONG].includes(mode) &&
    length <= maxLengthByMode.get(mode) &&
    length <= visibilityThreshold;

  if (isEmpty || isObvious) {
    return "";
  }

  return span({
    className: "objectLengthBubble"
  }, length);
}

const lengthBubble = wrapRender(GripLengthBubble);

function getTitle(props, object) {
  let objectLength = getLength(object);
  let isEmpty = objectLength === 0;

  if (isEmpty && props.mode === MODE.TINY) {
    if (object.class === "Array") {
      return "";
    }

    let title = props.title || object.class;

    return span({
        className: "objectTitle"},
      title,
      " "
    );
  }

  let title = props.title || object.class || "Array";

  if (props.mode === MODE.TINY) {
    title = object.class === "Array" ? "" : object.class;
  }

  const length = lengthBubble({
    length: objectLength,
    mode: props.mode
  });

  return span({
      className: "objectTitle"},
    title,
    " ",
    length,
    " "
  );
}

function getPreviewItems(grip) {
  if (!grip.preview) {
    return null;
  }

  return grip.preview.items || grip.preview.childNodes || [];
}

function arrayIterator(props, grip, max) {
  let { Rep } = require("./rep");

  let items = [];
  const gripLength = getLength(grip);

  if (!gripLength) {
    return items;
  }

  const previewItems = getPreviewItems(grip);
  let provider = props.provider;

  let emptySlots = 0;
  let foldedEmptySlots = 0;
  items = previewItems.reduce((res, itemGrip) => {
    if (res.length >= max) {
      return res;
    }

    let object;
    try {
      if (!provider && itemGrip === null) {
        emptySlots++;
        return res;
      }

      object = provider
        ? provider.getValue(itemGrip)
        : itemGrip;
    } catch (exc) {
      object = exc;
    }

    if (emptySlots > 0) {
      res.push(getEmptySlotsElement(emptySlots));
      foldedEmptySlots = foldedEmptySlots + emptySlots - 1;
      emptySlots = 0;
    }

    if (res.length < max) {
      res.push(Rep(Object.assign({}, props, {
        object,
        mode: MODE.TINY,
        // Do not propagate title to array items reps
        title: undefined,
      })));
    }

    return res;
  }, []);

  // Handle trailing empty slots if there are some.
  if (items.length < max && emptySlots > 0) {
    items.push(getEmptySlotsElement(emptySlots));
    foldedEmptySlots = foldedEmptySlots + emptySlots - 1;
  }

  const itemsShown = (items.length + foldedEmptySlots);
  if (gripLength > itemsShown) {
    items.push(getMoreEllipsisElement());
  }

  return items;
}

function getEmptySlotsElement(number) {
  // TODO: Use l10N - See https://github.com/devtools-html/reps/issues/141
  return `<${number} empty slot${number > 1 ? "s" : ""}>`;
}

function supportsObject(grip, noGrip = false) {
  if (noGrip === true || !isGrip(grip)) {
    return false;
  }

  return (grip.preview && (
      grip.preview.kind == "ArrayLike" ||
      getGripType(grip, noGrip) === "DocumentFragment"
    )
  );
}

const maxLengthMap = new Map();
maxLengthMap.set(MODE.SHORT, 3);
maxLengthMap.set(MODE.LONG, 10);

// Exports from this module
module.exports = {
  rep: wrapRender(GripArray),
  lengthBubble,
  supportsObject,
  maxLengthMap,
  getLength,
  getMoreEllipsisElement,
};
