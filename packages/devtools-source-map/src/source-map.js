/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

/**
 * Source Map Worker
 * @module utils/source-map-worker
 */

const { networkRequest } = require("devtools-utils");
const { SourceMapConsumer, SourceMapGenerator } = require("source-map");
const path = require("./utils/path");

const assert = require("./utils/assert");
const { fetchSourceMap } = require("./utils/fetchSourceMap");
const {
  getSourceMap,
  setSourceMap,
  clearSourceMaps
} = require("./utils/sourceMapRequests");
const {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
  getContentType
} = require("./utils");
const {
  getLocationScopes: getLocationScopesFromMap
} = require("devtools-map-bindings/src/scopes");

const { WasmRemap } = require("./utils/wasmRemap");

import type {
  Location,
  Source,
  SourceScope,
  MappedScopeBindings
} from "debugger-html";

async function getOriginalURLs(generatedSource: Source) {
  const map = await fetchSourceMap(generatedSource);
  return map && map.sources;
}

async function getGeneratedLocation(
  location: Location,
  originalSource: Source
): Promise<Location> {
  if (!isOriginalId(location.sourceId)) {
    return location;
  }

  const generatedSourceId = originalToGeneratedId(location.sourceId);
  const map = await getSourceMap(generatedSourceId);
  if (!map) {
    return location;
  }

  const { line, column } = map.generatedPositionFor({
    source: originalSource.url,
    line: location.line,
    column: location.column == null ? 0 : location.column,
    bias: SourceMapConsumer.LEAST_UPPER_BOUND
  });

  return {
    sourceId: generatedSourceId,
    line,
    column
  };
}

async function getOriginalLocation(location: Location): Promise<Location> {
  if (!isGeneratedId(location.sourceId)) {
    return location;
  }

  const map = await getSourceMap(location.sourceId);
  if (!map) {
    return location;
  }

  const { source: sourceUrl, line, column } = map.originalPositionFor({
    line: location.line,
    column: location.column == null ? 0 : location.column
  });

  if (sourceUrl == null) {
    // No url means the location didn't map.
    return location;
  }

  return {
    sourceId: generatedToOriginalId(location.sourceId, sourceUrl),
    sourceUrl,
    line,
    column
  };
}

async function getOriginalSourceText(originalSource: Source) {
  assert(isOriginalId(originalSource.id), "Source is not an original source");

  const generatedSourceId = originalToGeneratedId(originalSource.id);
  const map = await getSourceMap(generatedSourceId);
  if (!map) {
    return null;
  }

  let text = map.sourceContentFor(originalSource.url);
  if (!text) {
    text = (await networkRequest(originalSource.url, { loadFromCache: false }))
      .content;
  }

  return {
    text,
    contentType: getContentType(originalSource.url || "")
  };
}

/**
 * Finds the scope binding information at the source map based on locations and
 * generated source scopes. The generated source scopes contain variables names
 * and all their references in the generated source. This information is merged
 * with the source map original names information and returned as result.
 * @memberof utils/source-map-worker
 * @static
 */
async function getLocationScopes(
  location: Location,
  generatedSourceScopes: SourceScope[]
): Promise<MappedScopeBindings[] | null> {
  if (!isGeneratedId(location.sourceId)) {
    return null;
  }

  const map = await getSourceMap(location.sourceId);
  if (!map) {
    return null;
  }

  return getLocationScopesFromMap(map, generatedSourceScopes, location);
}

async function hasMappedSource(location: Location): Promise<boolean> {
  if (isOriginalId(location.sourceId)) {
    return true;
  }

  const loc = await getOriginalLocation(location);
  return loc.sourceId !== location.sourceId;
}

function applySourceMap(
  generatedId: string,
  url: string,
  code: string,
  mappings: Object
) {
  const generator = new SourceMapGenerator({ file: url });
  mappings.forEach(mapping => generator.addMapping(mapping));
  generator.setSourceContent(url, code);

  const map = SourceMapConsumer(generator.toJSON());
  setSourceMap(generatedId, Promise.resolve(map));
}

module.exports = {
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  getLocationScopes,
  applySourceMap,
  clearSourceMaps,
  hasMappedSource
};
