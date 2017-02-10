// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a symbol.
 */
const SymbolRep = React.createClass({
  displayName: "SymbolRep",

  propTypes: {
    object: React.PropTypes.object.isRequired
  },

  render: wrapRender(function () {
    let {object} = this.props;
    let {name} = object;

    return (
      span({className: "objectBox objectBox-symbol"},
        `Symbol(${name || ""})`
      )
    );
  }),
});

function supportsObject(object, type) {
  return (type == "symbol");
}

// Exports from this module
module.exports = {
  rep: SymbolRep,
  supportsObject: supportsObject,
};
