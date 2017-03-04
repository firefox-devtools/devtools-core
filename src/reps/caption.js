// Dependencies
const React = require("react");
const DOM = React.DOM;

const { wrapRender } = require("./rep-utils");

/**
 * Renders a caption. This template is used by other components
 * that needs to distinguish between a simple text/value and a label.
 */
const Caption = React.createClass({
  displayName: "Caption",

  propTypes: {
    object: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
    ]).isRequired,
  },

  render: wrapRender(function () {
    return (
      DOM.span({"className": "caption"}, this.props.object)
    );
  }),
});

// Exports from this module
module.exports = Caption;
