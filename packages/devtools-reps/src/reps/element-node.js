/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const PropTypes = require("prop-types");
const { span } = require("react-dom-factories");

// Utils
const {
  isGrip,
  wrapRender,
} = require("./rep-utils");
const {rep: StringRep} = require("./string");
const { MODE } = require("./constants");
const nodeConstants = require("../shared/dom-node-constants");
const Svg = require("../shared/images/Svg");

/**
 * Renders DOM element node.
 */
ElementNode.propTypes = {
  object: PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  onDOMNodeMouseOver: PropTypes.func,
  onDOMNodeMouseOut: PropTypes.func,
  onInspectIconClick: PropTypes.func,
};

function ElementNode(props) {
  let {
    object,
    mode,
    onDOMNodeMouseOver,
    onDOMNodeMouseOut,
    onInspectIconClick,
  } = props;
  let elements = getElements(object, mode);

  let isInTree = object.preview && object.preview.isConnected === true;

  let baseConfig = {
    "data-link-actor-id": object.actor,
    className: "objectBox objectBox-node"
  };
  let inspectIcon;
  if (isInTree) {
    if (onDOMNodeMouseOver) {
      Object.assign(baseConfig, {
        onMouseOver: _ => onDOMNodeMouseOver(object)
      });
    }

    if (onDOMNodeMouseOut) {
      Object.assign(baseConfig, {
        onMouseOut: onDOMNodeMouseOut
      });
    }

    if (onInspectIconClick) {
      inspectIcon = Svg("open-inspector", {
        element: "a",
        draggable: false,
        // TODO: Localize this with "openNodeInInspector" when Bug 1317038 lands
        title: "Click to select the node in the inspector",
        onClick: (e) => onInspectIconClick(object, e)
      });
    }
  }

  return span(baseConfig,
    ...elements,
    inspectIcon
  );
}

function getElements(grip, mode) {
  let {attributes, nodeName} = grip.preview;
  const nodeNameElement = span({
    className: "tag-name"
  }, nodeName);

  if (mode === MODE.TINY) {
    let elements = [nodeNameElement];
    if (attributes.id) {
      elements.push(
        span({className: "attrName"}, `#${attributes.id}`));
    }
    if (attributes.class) {
      elements.push(
        span({className: "attrName"},
          attributes.class
            .trim()
            .split(/\s+/)
            .map(cls => `.${cls}`)
            .join("")
        )
      );
    }
    return elements;
  }
  let attributeKeys = Object.keys(attributes);
  if (attributeKeys.includes("class")) {
    attributeKeys.splice(attributeKeys.indexOf("class"), 1);
    attributeKeys.unshift("class");
  }
  if (attributeKeys.includes("id")) {
    attributeKeys.splice(attributeKeys.indexOf("id"), 1);
    attributeKeys.unshift("id");
  }
  const attributeElements = attributeKeys.reduce((arr, name, i, keys) => {
    let value = attributes[name];
    let attribute = span({},
      span({className: "attrName"}, name),
      span({className: "attrEqual"}, "="),
      StringRep({className: "attrValue", object: value}),
    );

    return arr.concat([" ", attribute]);
  }, []);

  return [
    span({className: "angleBracket"}, "<"),
    nodeNameElement,
    ...attributeElements,
    span({className: "angleBracket"}, ">"),
  ];
}

// Registration
function supportsObject(object, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }
  return object.preview && object.preview.nodeType === nodeConstants.ELEMENT_NODE;
}

// Exports from this module
module.exports = {
  rep: wrapRender(ElementNode),
  supportsObject,
};
