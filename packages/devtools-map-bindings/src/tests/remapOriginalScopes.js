/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { remapOriginalScopes } = require("../remapOriginalScopes");

describe("remapsOrignalScopes", () => {
  it("simple", () => {
    const scopes = [
      {
        type: "function",
        bindings: { n: [], e: [], o: [], u: [], r: [], t: [] }
      },
      {
        type: "script",
        bindings: {}
      }
    ];
    const originalScopes = [
      {
        type: "block",
        bindings: {
          na: { expr: "o", type: "var" },
          nb: { expr: "u", type: "var" }
        }
      },
      {
        type: "block",
        bindings: {
          ma: { expr: "r", type: "var" },
          mb: { expr: "t", type: "var" }
        }
      },
      {
        type: "function",
        displayName: "compare()",
        bindings: {
          a: { expr: "n", type: "arg" },
          b: { expr: "e", type: "arg" }
        }
      }
    ];

    expect(remapOriginalScopes(scopes, originalScopes)).toMatchSnapshot();
  });
});
