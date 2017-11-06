/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import type {
  Location, SourceScope, Scope, MappedScopeBindings
} from "debugger-html";

export type ScopesDataSource = {
  getSourceMapsScopes: (location: Location) => Promise<MappedScopeBindings[]|null>,
};

function extendScope(
  scope: ?Scope,
  generatedScopes: MappedScopeBindings[],
  index: number
): ?Scope {
  if (!scope) {
    return undefined;
  }
  if (index >= generatedScopes.length) {
    return scope;
  }
  return (Object.assign({}, scope, {
    parent: extendScope(scope.parent, generatedScopes, index + 1),
    sourceBindings: generatedScopes[index].bindings
  }) : any);
}

async function updateScopeBindings(
  scope: ?Scope,
  location: Location,
  scopesDataSource: ScopesDataSource
): Promise<?Scope> {
  const generatedScopes = await scopesDataSource.getSourceMapsScopes(location);
  if (!generatedScopes) {
    return scope;
  }
  return extendScope(scope, generatedScopes, 0);
}

module.exports = {
  updateScopeBindings,
}
