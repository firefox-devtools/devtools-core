// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a number
 */
const Number = React.createClass({
  displayName: "Number",

  propTypes: {
    object: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number,
    ]).isRequired
  },

  stringify: function (object) {
    let isNegativeZero = Object.is(object, -0) ||
      (object.type && object.type == "-0");

    return (isNegativeZero ? "-0" : String(object));
  },

  render: wrapRender(function () {
    let value = this.props.object;

    return (
      span({className: "objectBox objectBox-number"},
        this.stringify(value)
      )
    );
  })
});

function supportsObject(object, type) {
  return ["boolean", "number", "-0"].includes(type);
}

// Exports from this module

module.exports = {
  rep: Number,
  supportsObject: supportsObject
};
