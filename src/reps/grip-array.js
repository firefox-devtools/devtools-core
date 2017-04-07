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
  attachedActorIds: React.PropTypes.array,
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
    items = [span({className: "length"}, isEmpty ? "" : objectLength)];
    brackets = needSpace(false);
  } else {
    let max = (mode === MODE.SHORT) ? 3 : 10;
    items = arrayIterator(props, object, max);
    brackets = needSpace(items.length > 0);
  }

  let title = getTitle(props, object);

  return (
    span({
      className: "objectBox objectBox-array"},
      title,
      safeObjectLink(props, {
        className: "arrayLeftBracket",
      }, brackets.left),
      ...items,
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

/**
 * Renders array item. Individual values are separated by
 * a delimiter (a comma by default).
 */
GripArrayItem.propTypes = {
  delim: React.PropTypes.string,
  object: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
  objectLink: React.PropTypes.func,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  provider: React.PropTypes.object,
  attachedActorIds: React.PropTypes.array,
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
};

function GripArrayItem(props) {
  let { Rep } = require("./rep");
  let {
    delim,
  } = props;

  return (
    span({},
      Rep(Object.assign({}, props, {
        mode: MODE.TINY
      })),
      delim
    )
  );
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
  let items = [];
  const gripLength = getLength(grip);

  if (!gripLength) {
    return items;
  }

  const previewItems = getPreviewItems(grip);
  if (!previewItems) {
    return items;
  }

  let delim;
  // number of grip preview items is limited to 10, but we may have more
  // items in grip-array.
  let delimMax = gripLength > previewItems.length ?
    previewItems.length : previewItems.length - 1;
  let provider = props.provider;

  for (let i = 0; i < previewItems.length && i < max; i++) {
    try {
      let itemGrip = previewItems[i];
      let value = provider ? provider.getValue(itemGrip) : itemGrip;

      delim = (i == delimMax ? "" : ", ");

      items.push(GripArrayItem(Object.assign({}, props, {
        object: value,
        delim: delim,
        // Do not propagate title to array items reps
        title: undefined,
      })));
    } catch (exc) {
      items.push(GripArrayItem(Object.assign({}, props, {
        object: exc,
        delim: delim,
        // Do not propagate title to array items reps
        title: undefined,
      })));
    }
  }
  if (previewItems.length > max || gripLength > previewItems.length) {
    let leftItemNum = gripLength - max > 0 ?
      gripLength - max : gripLength - previewItems.length;
    items.push(Caption({
      object: safeObjectLink(props, {}, leftItemNum + " more…")
    }));
  }

  return items;
}

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && (
      grip.preview.kind == "ArrayLike" ||
      type === "DocumentFragment"
    )
  );
}

// Exports from this module
module.exports = {
  rep: wrapRender(GripArray),
  supportsObject,
};
