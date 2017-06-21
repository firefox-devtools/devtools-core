/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  cropString,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
const Svg = require("../shared/images/Svg");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders DOM #text node.
 */
TextNode.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  objectLink: React.PropTypes.func,
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
};

function TextNode(props) {
  let {
    object: grip,
    mode = MODE.SHORT,
    onDOMNodeMouseOver,
    onDOMNodeMouseOut,
    onInspectIconClick,
  } = props;

  let baseConfig = {className: "objectBox objectBox-textNode"};
  let inspectIcon;
  let isInTree = grip.preview && grip.preview.isConnected === true;

  if (isInTree) {
    if (onDOMNodeMouseOver) {
      Object.assign(baseConfig, {
        onMouseOver: _ => onDOMNodeMouseOver(grip)
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
        onClick: (e) => onInspectIconClick(grip, e)
      });
    }
  }

  if (mode === MODE.TINY) {
    return DOM.span(baseConfig, getTitle(props, grip), inspectIcon);
  }

  return (
    DOM.span(baseConfig,
      getTitle(props, grip),
      DOM.span({className: "nodeValue"},
        " ",
        `"${getTextContent(grip)}"`
      ),
      inspectIcon
    )
  );
}

function getTextContent(grip) {
  return cropString(grip.preview.textContent);
}

function getTitle(props, grip) {
  const title = "#text";
  return safeObjectLink(props, {}, title);
}

// Registration
function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.class == "Text");
}

// Exports from this module
module.exports = {
  rep: wrapRender(TextNode),
  supportsObject,
};
