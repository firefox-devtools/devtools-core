/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { updateScopeBindings } = require("../updateScopeBindings");
const { getSource, getSourceMap, parseScopes } = require("./helpers");
const { getLocationScopes } = require("../scopes");

describe("updateScopeBindings", () => {
  it("parses simple generated/minified source", async () => {
    const source = getSource("sum.min");
    const location = {
      sourceId: source.id,
      line: 1,
      column: 27
    };
    const originalSource = getSource("sum");
    const originalLocation = {
      sourceId: originalSource.id,
      line: 2,
      column: 15,
    }
    const scopes = {
      actor: 'actor',
      bindings: {
        arguments: [{
          n: { value: 1 },
          u: { value: 2 }
        }],
        variables: {}
      },
      function: {
        actor: 'function-actor',
        class: 'Function',
        displayName: 'sum',
        location: location,
        parameterNames: ['n', 'u']
      },
      type: 'function'
    };
    const resultScopes = await updateScopeBindings(
      scopes,
      location,
      originalLocation,
      {
        async getSourceMapsScopes(location: Location) {
          const scopes = await parseScopes(location, source);
          const map = getSourceMap(source);
          const mappedScopes = getLocationScopes(map, scopes, location);
          return mappedScopes;
        },
        async getOriginalSourceScopes(location: Location) {
          const scopes = await parseScopes(location, originalSource);
          return scopes;
        },
        async getSourceMapsOriginalScopes(location) {
          return null;
        }
      }
    );
    expect(resultScopes).toMatchSnapshot();
  });
});
