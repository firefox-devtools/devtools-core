/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Utils
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
const nodeConstants = require("../shared/dom-node-constants");
const Svg = require("./images/Svg");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM element node.
 */
ElementNode.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
  objectLink: React.PropTypes.func,
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

  let baseConfig = {className: "objectBox objectBox-node"};
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
    safeObjectLink(props, {}, ...elements),
    inspectIcon
  );
}

function getElements(grip, mode) {
  let {attributes, nodeName} = grip.preview;
  const nodeNameElement = span({
    className: "tag-name theme-fg-color3"
  }, nodeName);

  if (mode === MODE.TINY) {
    let elements = [nodeNameElement];
    if (attributes.id) {
      elements.push(
        span({className: "attr-name theme-fg-color2"}, `#${attributes.id}`));
    }
    if (attributes.class) {
      elements.push(
        span({className: "attr-name theme-fg-color2"},
          attributes.class
            .replace(/(^\s+)|(\s+$)/g, "")
            .split(" ")
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
      span({className: "attr-name theme-fg-color2"}, `${name}`),
      `="`,
      span({className: "attr-value theme-fg-color6"}, `${value}`),
      `"`
    );

    return arr.concat([" ", attribute]);
  }, []);

  return [
    "<",
    nodeNameElement,
    ...attributeElements,
    ">",
  ];
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return object.preview && object.preview.nodeType === nodeConstants.ELEMENT_NODE;
}

// Exports from this module
module.exports = {
  rep: wrapRender(ElementNode),
  supportsObject,
};
