/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");
const { SourceMapConsumer } = require("source-map");

const { parseScopes } = require("./parseScopes");

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

function getSourceMap(source) {
  const name = source.id;
  const json = fs.readFileSync(
    path.join(__dirname, `../fixtures/${name}.js.map`),
    "utf8"
  );
  return new SourceMapConsumer(JSON.parse(json));
}

module.exports = {
  getSource,
  getSourceMap,
  parseScopes,
}
