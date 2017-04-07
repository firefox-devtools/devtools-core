// Dependencies
const React = require("react");
const DOM = React.DOM;

const { wrapRender } = require("./rep-utils");

/**
 * Renders a caption. This template is used by other components
 * that needs to distinguish between a simple text/value and a label.
 */
Caption.propTypes = {
  object: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]).isRequired,
};

function Caption(props) {
  return (
    DOM.span({"className": "caption"}, props.object)
  );
}

// Exports from this module
module.exports = wrapRender(Caption);
