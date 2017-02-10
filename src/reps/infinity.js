// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a Infinity object
 */
const InfinityRep = React.createClass({
  displayName: "Infinity",

  propTypes: {
    object: React.PropTypes.object.isRequired,
  },

  render: wrapRender(function () {
    return (
      span({className: "objectBox objectBox-number"},
        this.props.object.type
      )
    );
  })
});

function supportsObject(object, type) {
  return type == "Infinity" || type == "-Infinity";
}

// Exports from this module
module.exports = {
  rep: InfinityRep,
  supportsObject: supportsObject
};
