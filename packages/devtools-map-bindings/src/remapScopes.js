/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import type {
  Scope,
  SourceScope,
  MappedScopeBindings,
  SyntheticScope
} from "debugger-html";

export type RemappedScope = {
  scopes: SyntheticScope[],
  start: number,
  end: number
};

// Chunk split source scopes on function/closure boundary
function rollupFunctionScopes(scopes) {
  const { result } = scopes.reduce(
    ({ isLast, result }, scope) => {
      if (isLast) {
        result.push([]);
      }
      result[result.length - 1].push(scope);
      return {
        isLast: scope.type === "function",
        result
      };
    },
    { isLast: true, result: [] }
  );
  return result;
}

function getBindingNames(summarizedScopes) {
  return summarizedScopes.reduce(
    (acc, { bindingsNames }) => acc.concat(bindingsNames),
    []
  );
}

// Performs mapping of the original parsed scopes to the locals mappings
// based on the generated source parse and source map data.
function remapScopes(
  scopes: ?(SourceScope[]),
  generatedScopes: MappedScopeBindings[]
): ?(RemappedScope[]) {
  if (!scopes || scopes.length === 0) {
    return null;
  }
  const scopeChunks = rollupFunctionScopes(scopes);
  const { result: assigned } = scopeChunks.reduce(
    ({ result, searchIn, searchOffset }, scopeChunk) => {
      if (searchIn.length === 0) {
        return { result, searchIn, searchOffset };
      }
      // Process chunk of original parsed scopes: create used original names
      // binding summary per scope and entire chunk.
      const summarizedScopes = scopeChunk.map(({ type, bindings }) => ({
        type,
        bindingsNames: Object.keys(bindings)
      }));
      const names = getBindingNames(summarizedScopes);
      // ... and find these names in the generated scopes (with mapped
      // original names) -- we need index of the last scope in the searchIn.
      let foundInMax = names.reduce((max, name) => {
        const index = searchIn.findIndex(s => name in s.bindings);
        return index < 0 ? Math.max(index, max) : max;
      }, 0);

      // TODO double check if names were not matched/found -- the source maps
      // and scope parsing can be broken.
      // Moving to the function bounary (in generated scopes).
      while (
        foundInMax + 1 < searchIn.length &&
        searchIn[foundInMax].type !== "function"
      ) {
        foundInMax++;
      }

      // We found chunk of the function(s) that contains all/most of
      // the scopeChunk names -- adding finding to the result.
      result.push({
        scopes: summarizedScopes,
        start: searchOffset,
        end: searchOffset + foundInMax + 1
      });

      // Consuming generated scopes mappings (searchIn).
      return {
        result,
        searchIn: searchIn.slice(foundInMax + 1),
        searchOffset: searchOffset + foundInMax + 1
      };
    },
    { result: [], searchIn: generatedScopes, searchOffset: 0 }
  );
  return assigned;
}

module.exports = {
  remapScopes,
};
