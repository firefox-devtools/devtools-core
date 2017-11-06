/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

const { remapScopes } = require("./remapScopes");

import type {
  Location, SourceScope, Scope, SyntheticScope, MappedScopeBindings
} from "debugger-html";

export type ScopesDataSource = {
  getSourceMapsScopes: (location: Location) => Promise<MappedScopeBindings[]|null>,
  getOriginalSourceScopes: (location: Location) => Promise<?(SourceScope[])>,
};

function extendScope(
  scope: ?Scope,
  generatedScopes: MappedScopeBindings[],
  index: number,
  remapedScopes: ?({
    scopes: SyntheticScope[],
    start: number,
    end: number
  }[]),
  remapedScopesIndex: number
): ?Scope {
  if (!scope) {
    return undefined;
  }
  if (index >= generatedScopes.length) {
    return scope;
  }

  let syntheticScopes;
  if (remapedScopes && remapedScopesIndex < remapedScopes.length) {
    if (index >= remapedScopes[remapedScopesIndex].end) {
      remapedScopesIndex++;
    }
    if (remapedScopesIndex < remapedScopes.length) {
      const remapedScope = remapedScopes[remapedScopesIndex];
      syntheticScopes = {
        scopes: remapedScope.scopes,
        groupIndex: index - remapedScope.start,
        groupLength: remapedScope.end - remapedScope.start
      };
    }
  }

  const parent = extendScope(
    scope.parent,
    generatedScopes,
    index + 1,
    remapedScopes,
    remapedScopesIndex
  );
  return (Object.assign({}, scope, {
    parent,
    sourceBindings: generatedScopes[index].bindings,
    syntheticScopes
  }) : any);
}

async function updateScopeBindings(
  scope: ?Scope,
  location: Location,
  originalLocation: Location,
  scopesDataSource: ScopesDataSource
): Promise<?Scope> {
  const generatedScopes = await scopesDataSource.getSourceMapsScopes(location);
  if (!generatedScopes) {
    return scope;
  }
  const originalScopes = await scopesDataSource.getOriginalSourceScopes(originalLocation);
  const remapedScopes = remapScopes(originalScopes, generatedScopes);
  return extendScope(scope, generatedScopes, 0, remapedScopes, 0);
}

module.exports = {
  updateScopeBindings,
}
