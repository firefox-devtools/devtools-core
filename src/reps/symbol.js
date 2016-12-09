
const React = require("react");

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

  render: function () {
    let {object} = this.props;
    let {name} = object;

    return (
      span({className: "objectBox objectBox-symbol"},
        `Symbol(${name || ""})`
      )
    );
  },
});

function supportsObject(object, type) {
  return (type == "symbol");
}

module.exports = {
  rep: SymbolRep,
  supportsObject: supportsObject,
};
