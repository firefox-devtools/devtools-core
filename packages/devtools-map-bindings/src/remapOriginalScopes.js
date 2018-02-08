/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import type {
  Scope, SyntheticScope
} from "debugger-html";

import type { OriginalScope } from "./types";

function matchOriginalAndRuntimeScopes(originalScopes, runtimeScopes) {
  // Same as in remapScope: split on function boundary
  const { chunks } = originalScopes.reduce(
    ({ isLast, chunks: chunks_ }, s, index) => {
      let chunk;
      if (isLast) {
        chunk = {
          scopes: [],
          index
        };
        chunks_.push(chunk);
      } else {
        chunk = chunks_[chunks_.length - 1];
      }
      chunk.scopes.push(s);
      const isFunction = s.type === "function";
      return { isLast: isFunction, chunks: chunks_ };
    },
    { isLast: true, chunks: [] }
  );

  return chunks.reduce(
    ({ result, runtimeScopesTail, index }, chunk) => {
      const chunkGeneratedNames = chunk.scopes.reduce((acc, s) => {
        return acc.concat(s.generatedNames);
      }, []);

      // Find runtime scopes range that includes all names.
      const bestRuntimeScopeIndex = chunkGeneratedNames.reduce((max, name) => {
        const foundScopeIndex = runtimeScopesTail.findIndex(s =>
          s.generatedNames.includes(name)
        );
        return Math.max(max, foundScopeIndex);
      }, 0);
      // Snap to function border.
      // while (
      //   bestRuntimeScopeIndex + 1 < runtimeScopesTail.length &&
      //   runtimeScopesTail[bestRuntimeScopeIndex].type !== "function"
      // ) {
      //   bestRuntimeScopeIndex++;
      // }
      result.push({
        originalStart: chunk.index,
        originalEnd: chunk.index + chunk.scopes.length,
        start: index,
        end: index + bestRuntimeScopeIndex + 1
      });
      return {
        result,
        runtimeScopesTail: runtimeScopesTail.slice(bestRuntimeScopeIndex + 1),
        index: index + bestRuntimeScopeIndex + 1
      };
    },
    { result: [], runtimeScopesTail: runtimeScopes, index: 0 }
  ).result;
}

function remapOriginalScopes(
  scope: ?Scope,
  originalScopes: OriginalScope[]
): ?Scope {
  const runtimeScopesVars = [];
  const resultStack = [];
  for (let s = scope; s; s = s.parent) {
    const generatedNames = s.bindings
      ? s.bindings.arguments.reduce((acc, arg) => {
          return acc.concat(Object.keys(arg));
        }, Object.keys(s.bindings.variables))
      : [];
    runtimeScopesVars.push({
      type: s.type,
      generatedNames
    });
    resultStack.push(s);
  }
  const originalScopesVars = originalScopes.map(fs => {
    const generatedNames = Object.keys(fs.bindings).map(orignalName => {
      return fs.bindings[orignalName].expr;
    });
    return {
      type: fs.type,
      generatedNames
    };
  });
  const remapedScopes = matchOriginalAndRuntimeScopes(
    originalScopesVars,
    runtimeScopesVars
  );
  if (!remapedScopes) {
    return scope;
  }
  let result: ?Scope = null;
  for (let i = remapedScopes.length - 1; i >= 0; i--) {
    const { originalStart, originalEnd, start, end } = remapedScopes[i];
    // Skip if we have gaps
    while (end < resultStack.length) {
      result = (Object.assign({}, resultStack.pop(), {
        parent: result
      }) : any);
    }
    const groupLength = end - start;
    let groupIndex = groupLength - 1;
    const scopes: SyntheticScope[] = [];
    for (let j = originalStart; j < originalEnd; j++) {
      const { type, bindings } = originalScopes[j];
      const bindingsNames = Object.keys(bindings);
      const sourceBindings = bindingsNames.reduce((acc, name) => {
        acc[name] = bindings[name].expr;
        return acc;
      }, Object.create(null));
      scopes.push({
        type,
        bindingsNames,
        sourceBindings
      });
    }
    while (groupIndex >= 0) {
      result = (Object.assign({}, resultStack.pop(), {
        parent: result,
        syntheticScopes: {
          scopes,
          groupIndex,
          groupLength
        }
      }) : any);
      groupIndex--;
    }
  }
  return result;
}

module.exports = {
  remapOriginalScopes,
};
