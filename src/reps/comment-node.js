// Dependencies
const React = require("react");
const {
  isGrip,
  cropString,
  cropMultipleLines,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
const nodeConstants = require("../shared/dom-node-constants");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM comment node.
 */
CommentNode.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
};

function CommentNode(props) {
  let {
    object,
    mode = MODE.SHORT
  } = props;

  let {textContent} = object.preview;
  if (mode === MODE.TINY) {
    textContent = cropMultipleLines(textContent, 30);
  } else if (mode === MODE.SHORT) {
    textContent = cropString(textContent, 50);
  }

  return span({className: "objectBox theme-comment"}, `<!-- ${textContent} -->`);
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return object.preview && object.preview.nodeType === nodeConstants.COMMENT_NODE;
}

// Exports from this module
module.exports = {
  rep: wrapRender(CommentNode),
  supportsObject,
};
