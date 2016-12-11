const React = require("react");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders null value
 */
const Null = React.createClass({
  displayName: "NullRep",

  render: function () {
    return (
      span({className: "objectBox objectBox-null"},
        "null"
      )
    );
  },
});

function supportsObject(object, type) {
  if (object && object.type && object.type == "null") {
    return true;
  }

  return (object == null);
}

module.exports = {
  rep: Null,
  supportsObject: supportsObject
};
