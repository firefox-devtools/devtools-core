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

async function batchGeneratedLocations(locations: Location[], sourcesMap) {
  let posMap = {}
  for (const location of locations) {
     const {sourceId, column, line}  = location;
     const genLoc = await getGeneratedLocation(
       location,
       {url: sourcesMap[sourceId]}
    )


    posMap[sourceId] = posMap[sourceId] || {}
    posMap[sourceId][line] = posMap[sourceId][line] || {}
    posMap[sourceId][line][column] = genLoc;
  }

  return posMap;
}

async function getGeneratedLocation(
  location: Location,
  originalSource: {url: string}
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

async function getAllGeneratedLocations(
  location: Location,
  originalSource: Source
): Promise<Array<Location>> {
  if (!isOriginalId(location.sourceId)) {
    return [];
  }

  const generatedSourceId = originalToGeneratedId(location.sourceId);
  const map = await getSourceMap(generatedSourceId);
  if (!map) {
    return [];
  }

  const positions = map.allGeneratedPositionsFor({
    source: originalSource.url,
    line: location.line,
    column: location.column == null ? 0 : location.column,
    bias: SourceMapConsumer.LEAST_UPPER_BOUND
  });

  return positions.map(({ line, column }) => ({
    sourceId: generatedSourceId,
    line,
    column
  }));
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
  batchGeneratedLocations,
  getAllGeneratedLocations,
  getOriginalLocation,
  getOriginalSourceText,
  applySourceMap,
  clearSourceMaps,
  hasMappedSource
};
