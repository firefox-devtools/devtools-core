// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a NaN object
 */
const NaNRep = React.createClass({
  displayName: "NaN",

  render: wrapRender(function () {
    return (
      span({className: "objectBox objectBox-nan"},
        "NaN"
      )
    );
  })
});

function supportsObject(object, type) {
  return type == "NaN";
}

// Exports from this module
module.exports = {
  rep: NaNRep,
  supportsObject: supportsObject
};
