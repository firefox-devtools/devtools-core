// @flow

import type { MappedScopeBindings } from "debugger-html";
const { default: generate } = require("babel-generator");

const babylon = require("babylon");
const { default: traverse } = require("babel-traverse");

function replaceOriginalVariableName(
  expression: string,
  generatedScopes: MappedScopeBindings[]
): string {
  const ast = babylon.parse(expression, {
    sourceType: "module",
    plugins: ["jsx", "flow", "objectRestSpread"],
  });

  traverse(ast, {
    Identifier(path) {
      const { node: { name } } = path;
      const foundScope = generatedScopes.find(({ bindings }) => name in bindings);
      if (foundScope) {
        path.node.name = foundScope.bindings[name];
      }
    },
  });

  return generate(ast, { concise: true, compact: true }).code.replace(";", "");
}

module.exports = { replaceOriginalVariableName };
