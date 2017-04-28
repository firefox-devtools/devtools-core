// @flow

/**
 * Source Map Worker
 * @module utils/source-map-worker
 */

const { networkRequest } = require("devtools-utils");

const { parse } = require("url");
const path = require("./path");
const { SourceMapConsumer, SourceMapGenerator } = require("source-map");
const assert = require("./assert");
const {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
  getContentType,
} = require("./util");

import type { Location, Source } from "debugger-html";

let sourceMapRequests = new Map();

function clearSourceMaps() {
  sourceMapRequests.clear();
}

function _resolveSourceMapURL(source: Source) {
  const { url = "", sourceMapURL = "" } = source;
  if (path.isURL(sourceMapURL) || url == "") {
    // If it's already a full URL or the source doesn't have a URL,
    // don't resolve anything.
    return sourceMapURL;
  } else if (path.isAbsolute(sourceMapURL)) {
    // If it's an absolute path, it should be resolved relative to the
    // host of the source.
    const { protocol = "", host = "" } = parse(url);
    return `${protocol}//${host}${sourceMapURL}`;
  }
  // Otherwise, it's a relative path and should be resolved relative
  // to the source.
  return `${path.dirname(url)}/${sourceMapURL}`;
}

/**
 * Sets the source map's sourceRoot to be relative to the source map url.
 * @memberof utils/source-map-worker
 * @static
 */
function _setSourceMapRoot(sourceMap, absSourceMapURL, source) {
  // No need to do this fiddling if we won't be fetching any sources over the
  // wire.
  if (sourceMap.hasContentsOfAllSources()) {
    return;
  }

  const base = path.dirname(
    (absSourceMapURL.indexOf("data:") === 0 && source.url) ?
      source.url :
      absSourceMapURL
  );

  if (sourceMap.sourceRoot) {
    sourceMap.sourceRoot = path.join(base, sourceMap.sourceRoot);
  } else {
    sourceMap.sourceRoot = base;
  }

  return sourceMap;
}

function _getSourceMap(generatedSourceId: string)
    : ?Promise<SourceMapConsumer> {
  return sourceMapRequests.get(generatedSourceId);
}

async function _resolveAndFetch(generatedSource: Source) : SourceMapConsumer {
  // Fetch the sourcemap over the network and create it.
  const sourceMapURL = _resolveSourceMapURL(generatedSource);
  const fetched = await networkRequest(
    sourceMapURL, { loadFromCache: false }
  );

  // Create the source map and fix it up.
  const map = new SourceMapConsumer(fetched.content);
  _setSourceMapRoot(map, sourceMapURL, generatedSource);
  return map;
}

function _fetchSourceMap(generatedSource: Source) {
  const existingRequest = sourceMapRequests.get(generatedSource.id);
  if (existingRequest) {
    // If it has already been requested, return the request. Make sure
    // to do this even if sourcemapping is turned off, because
    // pretty-printing uses sourcemaps.
    //
    // An important behavior here is that if it's in the middle of
    // requesting it, all subsequent calls will block on the initial
    // request.
    return existingRequest;
  } else if (!generatedSource.sourceMapURL) {
    return Promise.resolve(null);
  }

  // Fire off the request, set it in the cache, and return it.
  const req = _resolveAndFetch(generatedSource).catch(e => console.error(e));
  sourceMapRequests.set(generatedSource.id, req);
  return req;
}

async function getOriginalURLs(generatedSource: Source) {
  const map = await _fetchSourceMap(generatedSource);
  return map && map.sources;
}

async function getGeneratedLocation(location: Location, originalSource: Source)
    : Promise<Location> {
  if (!isOriginalId(location.sourceId)) {
    return location;
  }

  const generatedSourceId = originalToGeneratedId(location.sourceId);
  const map = await _getSourceMap(generatedSourceId);
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
    line: line,
    // Treat 0 as no column so that line breakpoints work correctly.
    column: column === 0 ? undefined : column
  };
}

async function getOriginalLocation(location: Location) : Promise<Location> {
  if (!isGeneratedId(location.sourceId)) {
    return location;
  }

  const map = await _getSourceMap(location.sourceId);
  if (!map) {
    return location;
  }

  const { source: url, line, column } = map.originalPositionFor({
    line: location.line,
    column: location.column == null ? Infinity : location.column
  });

  if (url == null) {
    // No url means the location didn't map.
    return location;
  }

  return {
    sourceId: generatedToOriginalId(location.sourceId, url),
    sourceUrl: url,
    line,
    column
  };
}

async function getOriginalSourceText(originalSource: Source) {
  assert(isOriginalId(originalSource.id),
         "Source is not an original source");

  const generatedSourceId = originalToGeneratedId(originalSource.id);
  const map = await _getSourceMap(generatedSourceId);
  if (!map) {
    return null;
  }

  let text = map.sourceContentFor(originalSource.url);
  if (!text) {
    text = (await networkRequest(
      originalSource.url, { loadFromCache: false }
    )).content;
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
  generatedId: string, url: string, code: string, mappings: Object) {
  const generator = new SourceMapGenerator({ file: url });
  mappings.forEach(mapping => generator.addMapping(mapping));
  generator.setSourceContent(url, code);

  const map = SourceMapConsumer(generator.toJSON());
  sourceMapRequests.set(generatedId, Promise.resolve(map));
}

module.exports = {
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  applySourceMap,
  clearSourceMaps,
  hasMappedSource,
};
