// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders null value
 */
const Null = React.createClass({
  displayName: "NullRep",

  render: wrapRender(function () {
    return (
      span({className: "objectBox objectBox-null"},
        "null"
      )
    );
  }),
});

function supportsObject(object, type) {
  if (object && object.type && object.type == "null") {
    return true;
  }

  return (object == null);
}

// Exports from this module

module.exports = {
  rep: Null,
  supportsObject: supportsObject
};
