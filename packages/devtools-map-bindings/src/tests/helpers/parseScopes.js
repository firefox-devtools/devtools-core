/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { createParseJSScopeVisitor, findScopes } = require("../../parser");

const babylon = require("babylon");
const { default: traverse } = require("babel-traverse");

function traverseAst(source, visitor) {
  const code = source.text;
  const ast = babylon.parse(
    code,
    {
      sourceType: "module",
      plugins: ["jsx", "flow", "objectRestSpread"]
    }
  );

  traverse(ast, visitor);
}

function parseScopes(location, source) {
  const { sourceId } = location;
  const visitor = createParseJSScopeVisitor(sourceId);
  traverseAst(source, visitor.traverseVisitor);
  const parsedScopes = visitor.toParsedScopes();
  return findScopes(parsedScopes, location);
}

module.exports = {
  parseScopes,
};
