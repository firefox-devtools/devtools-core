/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Dependencies
const React = require("react");
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const Caption = require("./caption");
const { MODE } = require("./constants");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders an array. The array is enclosed by left and right bracket
 * and the max number of rendered items depends on the current mode.
 */
GripArray.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  provider: React.PropTypes.object,
  objectLink: React.PropTypes.func,
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
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
    let objectLength = getLength(object);
    let isEmpty = objectLength === 0;
    items = [span({
      className: "length",
    }, isEmpty ? "" : objectLength)];
    brackets = needSpace(false);
  } else {
    let max = maxLengthMap.get(mode);
    items = arrayIterator(props, object, max);
    brackets = needSpace(items.length > 0);
  }

  let title = getTitle(props, object);

  return (
    span({
      "data-link-actor-id": object.actor,
      className: "objectBox objectBox-array"},
      title,
      safeObjectLink(props, {
        className: "arrayLeftBracket",
      }, brackets.left),
      ...interleaveCommas(items),
      safeObjectLink(props, {
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

function getTitle(props, object, context) {
  if (props.mode === MODE.TINY) {
    return "";
  }

  let title = props.title || object.class || "Array";
  return safeObjectLink(props, {}, title + " ");
}

function getPreviewItems(grip) {
  if (!grip.preview) {
    return null;
  }

  return grip.preview.items || grip.preview.childNodes || null;
}

function arrayIterator(props, grip, max) {
  let { Rep } = require("./rep");

  let items = [];
  const gripLength = getLength(grip);

  if (!gripLength) {
    return items;
  }

  const previewItems = getPreviewItems(grip);
  if (!previewItems) {
    return items;
  }

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
    items.push(Caption({
      object: safeObjectLink(props, {}, "more…")
    }));
  }

  return items;
}

function getEmptySlotsElement(number) {
  // TODO: Use l10N - See https://github.com/devtools-html/reps/issues/141
  return `<${number} empty slot${number > 1 ? "s" : ""}>`;
}

function supportsObject(grip, type, noGrip = false) {
  if (noGrip === true || !isGrip(grip)) {
    return false;
  }

  return (grip.preview && (
      grip.preview.kind == "ArrayLike" ||
      type === "DocumentFragment"
    )
  );
}

const maxLengthMap = new Map();
maxLengthMap.set(MODE.SHORT, 3);
maxLengthMap.set(MODE.LONG, 10);

// Exports from this module
module.exports = {
  rep: wrapRender(GripArray),
  supportsObject,
  maxLengthMap,
};
