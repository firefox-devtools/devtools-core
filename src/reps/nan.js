// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a NaN object
 */
function NaNRep(props) {
  return (
    span({className: "objectBox objectBox-nan"},
      "NaN"
    )
  );
}

function supportsObject(object, type) {
  return type == "NaN";
}

// Exports from this module
module.exports = {
  rep: wrapRender(NaNRep),
  supportsObject,
};
