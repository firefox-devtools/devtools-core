
const React = require("devtools/client/shared/vendor/react");

// Reps
const { isGrip, cropMultipleLines } = require("./rep-utils");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders DOM #text node.
 */
let TextNode = React.createClass({
  displayName: "TextNode",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string,
  },

  getTextContent: function (grip) {
    return cropMultipleLines(grip.preview.textContent);
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: grip
      }, "#text");
    }
    return "";
  },

  render: function () {
    let grip = this.props.object;
    let mode = this.props.mode || "short";

    if (mode == "short" || mode == "tiny") {
      return (
        DOM.span({className: "objectBox objectBox-textNode"},
          this.getTitle(grip),
          "\"" + this.getTextContent(grip) + "\""
        )
      );
    }

    let objectLink = this.props.objectLink || DOM.span;
    return (
      DOM.span({className: "objectBox objectBox-textNode"},
        this.getTitle(grip),
        objectLink({
          object: grip
        }, "<"),
        DOM.span({className: "nodeTag"}, "TextNode"),
        " textContent=\"",
        DOM.span({className: "nodeValue"},
          this.getTextContent(grip)
        ),
        "\"",
        objectLink({
          object: grip
        }, ">;")
      )
    );
  },
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.class == "Text");
}

module.exports = {
  rep: TextNode,
  supportsObject: supportsObject
};
