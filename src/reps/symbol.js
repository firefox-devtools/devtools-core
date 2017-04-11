// Dependencies
const React = require("react");

const { wrapRender } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a symbol.
 */
SymbolRep.propTypes = {
  object: React.PropTypes.object.isRequired
};

function SymbolRep(props) {
  let {object} = props;
  let {name} = object;

  return (
    span({className: "objectBox objectBox-symbol"},
      `Symbol(${name || ""})`
    )
  );
}

function supportsObject(object, type) {
  return (type == "symbol");
}

// Exports from this module
module.exports = {
  rep: wrapRender(SymbolRep),
  supportsObject,
};
