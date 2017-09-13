
let sourceMapRequests = new Map();

function clearSourceMaps() {
  sourceMapRequests.clear();
}


function getSourceMap(generatedSourceId: string)
    : ?Promise<SourceMapConsumer> {
  return sourceMapRequests.get(generatedSourceId);
}

function setSourceMap(generatedId, request) {
  sourceMapRequests.set(generatedId, request);
}

module.exports = {
  clearSourceMaps,
  getSourceMap,
  setSourceMap
};
