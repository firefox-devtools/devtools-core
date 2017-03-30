// @flow

const {
  originalToGeneratedId,
  generatedToOriginalId,
  isGeneratedId,
  isOriginalId,
} = require("./util");

const { workerUtils: { WorkerDispatcher }} = require("devtools-utils");

import type { Location } from "debugger-html";

const dispatcher = new WorkerDispatcher();

const getOriginalURLs = dispatcher.task("getOriginalURLs");
const getGeneratedLocation = dispatcher.task("getGeneratedLocation");
const getOriginalLocation = dispatcher.task("getOriginalLocation");
const getOriginalSourceText = dispatcher.task("getOriginalSourceText");
const applySourceMap = dispatcher.task("applySourceMap");
const clearSourceMaps = dispatcher.task("clearSourceMaps");
const hasMappedSource = dispatcher.task("hasMappedSource");

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
  startSourceMapWorker: dispatcher.start.bind(dispatcher),
  stopSourceMapWorker: dispatcher.stop.bind(dispatcher),
};
