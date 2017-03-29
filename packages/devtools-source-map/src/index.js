// @flow
/* global DebuggerConfig */

const {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
} = require("./util");

const { workerUtils: { workerTask }} = require("devtools-modules");
const { setConfig, getValue } = require("devtools-config");

import type { Location } from "devtools-client-adapters/src/types";

// TODO: Rename this to something not specific to debugger (#265)
// $FlowIgnore: global DebuggerConfig
setConfig(DebuggerConfig);

let sourceMapWorker;
function restartWorker() {
  if (sourceMapWorker) {
    sourceMapWorker.terminate();
  }

  sourceMapWorker = new Worker(getValue("workers.sourceMapURL"));
  sourceMapWorker.onerror = () => {
    console.error("Error in source map worker");
  };
}

restartWorker();

function destroyWorker() {
  if (sourceMapWorker) {
    sourceMapWorker.terminate();
    sourceMapWorker = null;
  }
}

async function hasMappedSource(location: Location): Promise<boolean> {
  if (isOriginalId(location.sourceId)) {
    return true;
  }

  const loc = await getOriginalLocation(location);
  return loc.sourceId !== location.sourceId;
}

const getOriginalURLs = workerTask(sourceMapWorker, "getOriginalURLs");
const getGeneratedLocation = workerTask(
  sourceMapWorker,
  "getGeneratedLocation",
);
const getOriginalLocation = workerTask(sourceMapWorker, "getOriginalLocation");
const getOriginalSourceText = workerTask(
  sourceMapWorker,
  "getOriginalSourceText",
);
const applySourceMap = workerTask(sourceMapWorker, "applySourceMap");
const clearSourceMaps = workerTask(sourceMapWorker, "clearSourceMaps");

module.exports = {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
  hasMappedSource,
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  applySourceMap,
  clearSourceMaps,
  destroyWorker,
};
