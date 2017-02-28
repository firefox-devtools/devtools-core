// @flow

const { getValue } = require("devtools-config");
const {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
  workerTask,
} = require("./util");

const WORKER_PATH = "devtools-source-map/worker.js";

import type { Location } from "../types";

let sourceMapWorker;
function restartWorker() {
  if (sourceMapWorker) {
    sourceMapWorker.terminate();
  }
  sourceMapWorker = new Worker(`${getValue("baseWorkerURL")}${WORKER_PATH}`);
  sourceMapWorker.onerror = () => {
    console.error("Error in source map worker");
  };

  sourceMapWorker.postMessage({ id: 0, method: "enableSourceMaps" });
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
const getGeneratedLocation = workerTask(sourceMapWorker,
                                        "getGeneratedLocation");
const getOriginalLocation = workerTask(sourceMapWorker,
                                       "getOriginalLocation");
const getOriginalSourceText = workerTask(sourceMapWorker,
                                         "getOriginalSourceText");
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
