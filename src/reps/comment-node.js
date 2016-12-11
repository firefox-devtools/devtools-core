const React = require("react");
const { isGrip, cropString, cropMultipleLines } = require("./rep-utils");
const { MODE } = require("./constants");
const nodeConstants = require("../shared/dom-node-constants");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM comment node.
 */
const CommentNode = React.createClass({
  displayName: "CommentNode",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  },

  render: function () {
    let {
      object,
      mode = MODE.SHORT
    } = this.props;

    let {textContent} = object.preview;
    if (mode === MODE.TINY) {
      textContent = cropMultipleLines(textContent, 30);
    } else if (mode === MODE.SHORT) {
      textContent = cropString(textContent, 50);
    }

    return span({className: "objectBox theme-comment"}, `<!-- ${textContent} -->`);
  },
});

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return object.preview && object.preview.nodeType === nodeConstants.COMMENT_NODE;
}

module.exports = {
  rep: CommentNode,
  supportsObject: supportsObject
};
