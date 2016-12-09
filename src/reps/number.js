
const React = require("devtools/client/shared/vendor/react");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a number
 */
const Number = React.createClass({
  displayName: "Number",

  stringify: function (object) {
    let isNegativeZero = Object.is(object, -0) ||
      (object.type && object.type == "-0");

    return (isNegativeZero ? "-0" : String(object));
  },

  render: function () {
    let value = this.props.object;

    return (
      span({className: "objectBox objectBox-number"},
        this.stringify(value)
      )
    );
  }
});

function supportsObject(object, type) {
  return type == "boolean" || type == "number" ||
    (type == "object" && object.type == "-0");
}

module.exports = {
  rep: Number,
  supportsObject: supportsObject
};
