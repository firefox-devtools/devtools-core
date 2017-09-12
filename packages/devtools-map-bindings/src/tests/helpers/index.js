/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");

const babylon = require("babylon");
const { default: traverse } = require("babel-traverse");

function getSource(name, type = "js") {
  const text = fs.readFileSync(
    path.join(__dirname, `../fixtures/${name}.${type}`),
    "utf8"
  );
  const contentType = type === "html" ? "text/html" : "text/javascript";
  return {
    id: name,
    text,
    contentType
  };
}

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

module.exports = {
  getSource,
  traverseAst,
}
