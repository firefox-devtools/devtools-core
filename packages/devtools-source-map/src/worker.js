const {
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  hasMappedSource,
  applySourceMap,
  clearSourceMaps
} = require("./source-map");

const { workerUtils: { workerHandler }} = require("devtools-utils");

// The interface is implemented in source-map to be
// easier to unit test.
self.onmessage = workerHandler({
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  hasMappedSource,
  applySourceMap,
  clearSourceMaps
})
