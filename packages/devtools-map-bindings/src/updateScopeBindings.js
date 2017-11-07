/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

const { remapScopes } = require("./remapScopes");
const { remapOriginalScopes } = require("./remapOriginalScopes");

import type {
  Location, SourceScope, Scope, SyntheticScope, MappedScopeBindings
} from "debugger-html";

import type {
  OriginalScope, ScopesDataSource
} from "./types";

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
  if (!scope) {
    return null;
  }

  const originalScopes = await scopesDataSource.getSourceMapsOriginalScopes(location);
  if (originalScopes) {
    return remapOriginalScopes(scope, originalScopes);
  }

  const generatedScopes = await scopesDataSource.getSourceMapsScopes(location);
  if (!generatedScopes) {
    return scope;
  }
  const originalParsedScopes = await scopesDataSource.getOriginalSourceScopes(originalLocation);
  const remapedScopes = remapScopes(originalParsedScopes, generatedScopes);
  return extendScope(scope, generatedScopes, 0, remapedScopes, 0);
}

module.exports = {
  updateScopeBindings,
}
