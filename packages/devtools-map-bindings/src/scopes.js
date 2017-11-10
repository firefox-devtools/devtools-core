/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

const { SourceMapConsumer } = require("source-map");

import type {
  Location, SourceScope, MappedScopeBindings
} from "debugger-html";

type SourceMapPosition = {
  line: number,
  column: number
};

function comparePositions(a: SourceMapPosition, b: SourceMapPosition): number {
  if (a.line === b.line) {
    return a.column - b.column;
  } else {
    return a.line - b.line;
  }
}

function getOriginalPositionName(
  map: SourceMapConsumer,
  generatedPosition: SourceMapPosition,
): (string|null) {
  const originalPosition = map.originalPositionFor(generatedPosition);
  if (!originalPosition || !originalPosition.name) {
    return null;
  }
  // Verify if it's the exact position.
  const originalPositionTest = map.originalPositionFor({
    line: generatedPosition.line,
    column: generatedPosition.column,
    bias: SourceMapConsumer.LEAST_UPPER_BOUND
  });
  if (
    !originalPositionTest ||
    originalPositionTest.column !== originalPosition.column ||
    originalPositionTest.line !== originalPosition.line
  ) {
    return null;
  }
  return originalPosition.name;
}

// The `scope` has bindings that contains positions/references to the
// generated names (these may has different original name). Going over all
// these names and positions, to check what original name is listed there.
// To make things more interesting the same generated name can potentially
// be used for different original names, so building trackedBindings for all
// names and positions.
// Example of MappedScopeBindings:
// ```
// { type: 'block',
//   bindings: {
//     'current': 't',
//     'start': 't',
//     'end': 'e'
//   } }
// ```

type TrackedBindings = { [originalName: string]:
  {
    generatedName: string,
    bestPosition: SourceMapPosition
  }
};

function applyBestNamePosition(
  trackedBindings: TrackedBindings,
  generatedName: string,
  nameLocation: Location,
  map: SourceMapConsumer,
  currentPosition: SourceMapPosition
): TrackedBindings {
  const namePosition: SourceMapPosition = {
    line: nameLocation.line,
    column: nameLocation.column || 0
  }
  const originalName = getOriginalPositionName(map, namePosition);
  if (!originalName) {
    return trackedBindings;
  }

  let trackedBinding = trackedBindings[originalName];
  if (!trackedBinding) {
    // No best position was found for original name yet -- using first
    // found position.
    trackedBindings[originalName] = {
      generatedName,
      bestPosition: namePosition
    };
  } else if (comparePositions(namePosition, currentPosition) <= 0) {
    // The position is before location, the more recient will have needed
    // name assignment, also discard all positions past currentPosition.
    if (
      comparePositions(trackedBinding.bestPosition, namePosition) < 0 ||
      comparePositions(trackedBinding.bestPosition, currentPosition) > 0
    ) {
      trackedBinding.generatedName = generatedName;
      trackedBinding.bestPosition = namePosition;
    }
  } else {
    // The position is past location, need to select more recient after
    // specified location, but only if "before" bestPosition is not found.
    if (
      comparePositions(trackedBinding.bestPosition, namePosition) > 0 &&
      comparePositions(trackedBinding.bestPosition, currentPosition) < 0
    ) {
      trackedBinding.generatedName = generatedName;
      trackedBinding.bestPosition = namePosition;
    }
  }
  return trackedBindings;
}

function applyTrackedBindings(
  trackedBindings: TrackedBindings,
  generatedName: string,
  locations: Location[],
  map: SourceMapConsumer,
  currentPosition: SourceMapPosition
): TrackedBindings {
  return locations.reduce(
    (trackedBindings, nameLocation) =>
      applyBestNamePosition(
        trackedBindings,
        generatedName,
        nameLocation,
        map,
        currentPosition
      ),
    trackedBindings
  );
}

/**
 * Finds the scope binding information at the source map based on locations and
 * generated source scopes. The generated source scopes contain variables names
 * and all their references in the generated source. This information is merged
 * with the source map original names information and returned as result.
 */
function getLocationScopes(
  map: SourceMapConsumer,
  generatedSourceScopes: SourceScope[],
  location: Location,
) : (MappedScopeBindings[]|null) {
  const currentPosition: SourceMapPosition = {
    line: location.line,
    column: location.column || 0
  }

  return generatedSourceScopes.map(scope => {
    const trackedBindings: TrackedBindings =
      Object.keys(scope.bindings).reduce(
        (trackedBindings, generatedName) =>
          applyTrackedBindings(
            trackedBindings,
            generatedName,
            scope.bindings[generatedName],
            map,
            currentPosition
          ),
        Object.create(null)
      );

    const bindings = Object.keys(trackedBindings).reduce((bindings, name) => {
      const { generatedName } = trackedBindings[name];
      bindings[name] = generatedName;
      return bindings;
    }, Object.create(null));

    if (
      Object.keys(bindings).length === 0 &&
      Object.keys(scope.bindings).length > 0
    ) {
      // Parsing found identifiers in this scope, but source maps has no data
      // (corrupted or missing names section). Recovering names as identity
      // mapping.
      Object.keys(scope.bindings).forEach(
        generatedName => bindings[generatedName] = generatedName
      );
    }
    return {
      type: scope.type,
      bindings,
    };
  });
}

module.exports = {
  getLocationScopes
}
