/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
  let {
    className = "objectBox objectBox-symbol",
    object,
  } = props;
  let {name} = object;

  return span({className}, `Symbol(${name || ""})`);
}

function supportsObject(object, type) {
  return (type == "symbol");
}

// Exports from this module
module.exports = {
  rep: wrapRender(SymbolRep),
  supportsObject,
};
