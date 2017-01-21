// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders undefined value
 */
const Undefined = React.createClass({
  displayName: "UndefinedRep",

  render: wrapRender(function () {
    return (
      span({className: "objectBox objectBox-undefined"},
        "undefined"
      )
    );
  }),
});

function supportsObject(object, type) {
  if (object && object.type && object.type == "undefined") {
    return true;
  }

  return (type == "undefined");
}

// Exports from this module

module.exports = {
  rep: Undefined,
  supportsObject: supportsObject
};
