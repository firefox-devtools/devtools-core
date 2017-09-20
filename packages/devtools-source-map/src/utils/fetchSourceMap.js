/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

const { networkRequest } = require("devtools-utils");
const { getSourceMap, setSourceMap } = require("./sourceMapRequests");
const { WasmRemap } = require("./wasmRemap");
const { SourceMapConsumer } = require("source-map");

const path = require("./path");

const URL_ISH = new RegExp("^[a-z]+:/");

import type {
  Location,
  Source,
  SourceScope,
  MappedScopeBindings
} from "debugger-html";

/**
 * Sets the source map's sourceRoot to be relative to the source map url.
 * @memberof utils/source-map-worker
 * @static
 */
function _setSourceMapRoot(
  sourceMap: Object,
  absSourceMapURL: string,
  source: Source
) {
  // No need to do this fiddling if we won't be fetching any sources
  // over the wire.  However, we do still want to if any of the source
  // URLs are relative.  What's difficult is that we want to pretend
  // that some non-URLs, like "webpack:/whatever", are actually URLs.
  if (sourceMap.hasContentsOfAllSources()) {
    const allURLsAreAbsolute = sourceMap.sources.every(sourceName => {
      return URL_ISH.test(sourceName);
    });
    if (allURLsAreAbsolute) {
      return;
    }
  }

  // If it's already a URL, just leave it alone.
  if (!path.isURL(sourceMap.sourceRoot)) {
    // In the odd case where the sourceMap is a data: URL and it does
    // not contain the full sources, fall back to using the source's
    // URL, if possible.
    let parsedSourceMapURL = new URL(absSourceMapURL);

    if (parsedSourceMapURL.protocol === "data:" && source.url) {
      parsedSourceMapURL = new URL(source.url);
    }

    parsedSourceMapURL.pathname = path.dirname(parsedSourceMapURL.pathname);
    sourceMap.sourceRoot = new URL(
      sourceMap.sourceRoot || "",
      parsedSourceMapURL
    ).toString();
  }
}

function _resolveSourceMapURL(source: Source) {
  const { url = "", sourceMapURL = "" } = source;
  if (path.isURL(sourceMapURL) || url == "") {
    // If it's already a full URL or the source doesn't have a URL,
    // don't resolve anything.
    return sourceMapURL;
  }

  if (path.isAbsolute(sourceMapURL)) {
    // If it's an absolute path, it should be resolved relative to the
    // host of the source.
    const { protocol = "", host = "" } = new URL(url);
    return `${protocol}//${host}${sourceMapURL}`;
  }

  // Otherwise, it's a relative path and should be resolved relative
  // to the source.
  return `${path.dirname(url)}/${sourceMapURL}`;
}

async function _resolveAndFetch(generatedSource: Source): SourceMapConsumer {
  // Fetch the sourcemap over the network and create it.
  const sourceMapURL = _resolveSourceMapURL(generatedSource);

  const fetched = await networkRequest(sourceMapURL, { loadFromCache: false });

  // Create the source map and fix it up.
  let map = new SourceMapConsumer(fetched.content);
  if (generatedSource.isWasm) {
    map = new WasmRemap(map);
  }

  _setSourceMapRoot(map, sourceMapURL, generatedSource);
  return map;
}

function fetchSourceMap(generatedSource: Source) {
  const existingRequest = getSourceMap(generatedSource.id);

  // If it has already been requested, return the request. Make sure
  // to do this even if sourcemapping is turned off, because
  // pretty-printing uses sourcemaps.
  //
  // An important behavior here is that if it's in the middle of
  // requesting it, all subsequent calls will block on the initial
  // request.
  if (existingRequest) {
    return existingRequest;
  }

  if (!generatedSource.sourceMapURL) {
    return Promise.resolve(null);
  }

  // Fire off the request, set it in the cache, and return it.
  const req = _resolveAndFetch(generatedSource);
  // Make sure the cached promise does not reject, because we only
  // want to report the error once.
  setSourceMap(generatedSource.id, req.catch(() => null));
  return req;
}

module.exports = { fetchSourceMap };
