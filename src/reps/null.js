// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders null value
 */
function Null(props) {
  return (
    span({className: "objectBox objectBox-null"},
      "null"
    )
  );
}

function supportsObject(object, type) {
  if (object && object.type && object.type == "null") {
    return true;
  }

  return (object == null);
}

// Exports from this module

module.exports = {
  rep: wrapRender(Null),
  supportsObject,
};
