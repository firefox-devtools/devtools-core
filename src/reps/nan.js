const React = require("react");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a NaN object
 */
const NaNRep = React.createClass({
  displayName: "NaN",

  render: function () {
    return (
      span({className: "objectBox objectBox-nan"},
        "NaN"
      )
    );
  }
});

function supportsObject(object, type) {
  return type == "NaN";
}

module.exports = {
  rep: NaNRep,
  supportsObject: supportsObject
};
