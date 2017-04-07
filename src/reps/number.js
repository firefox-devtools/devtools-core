// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a number
 */
Number.propTypes = {
  object: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number,
    React.PropTypes.bool,
  ]).isRequired
};

function Number(props) {
  let value = props.object;

  return (
    span({className: "objectBox objectBox-number"},
      stringify(value)
    )
  );
}

function stringify(object) {
  let isNegativeZero = Object.is(object, -0) ||
    (object.type && object.type == "-0");

  return (isNegativeZero ? "-0" : String(object));
}

function supportsObject(object, type) {
  return ["boolean", "number", "-0"].includes(type);
}

// Exports from this module

module.exports = {
  rep: wrapRender(Number),
  supportsObject,
};
