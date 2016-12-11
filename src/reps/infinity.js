const React = require("react");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a Infinity object
 */
const InfinityRep = React.createClass({
  displayName: "Infinity",

  render: function () {
    return (
      span({className: "objectBox objectBox-number"},
        this.props.object.type
      )
    );
  }
});

function supportsObject(object, type) {
  return type == "Infinity" || type == "-Infinity";
}

module.exports = {
  rep: InfinityRep,
  supportsObject: supportsObject
};
