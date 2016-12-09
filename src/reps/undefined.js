
const React = require("react");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders undefined value
 */
const Undefined = React.createClass({
  displayName: "UndefinedRep",

  render: function () {
    return (
      span({className: "objectBox objectBox-undefined"},
        "undefined"
      )
    );
  },
});

function supportsObject(object, type) {
  if (object && object.type && object.type == "undefined") {
    return true;
  }

  return (type == "undefined");
}

module.exports = {
  rep: Undefined,
  supportsObject: supportsObject
};
