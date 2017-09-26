/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { getSource, parseScopes } = require("./helpers");

import type { Source, Location, SourceScope } from "debugger-html";

describe("parseScopes", () => {
  it("parses simple generated/minified es5 source", () => {
    const source = getSource("es5");
    const location = {
      sourceId: source.id,
      line: 1,
      column: 59
    };
    const scopes = parseScopes(location, source);
    expect(scopes).toMatchSnapshot();
  });

  it("parses es6 source", () => {
    const source = getSource("es6");
    const location = {
      sourceId: source.id,
      line: 4,
      column: 3
    };
    const scopes = parseScopes(location, source);
    expect(scopes).toMatchSnapshot();
  });
});
