const React = require("devtools/client/shared/vendor/react");
const DOM = React.DOM;

/**
 * Renders a caption. This template is used by other components
 * that needs to distinguish between a simple text/value and a label.
 */
const Caption = React.createClass({
  displayName: "Caption",

  render: function () {
    return (
      DOM.span({"className": "caption"}, this.props.object)
    );
  },
});

module.exports = Caption;
