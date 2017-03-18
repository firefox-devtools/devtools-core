const {
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  applySourceMap,
  clearSourceMaps
} = require("./source-map");


// The interface is implemented in source-map to be
// easier to unit test.
const publicInterface = {
  getOriginalURLs,
  getGeneratedLocation,
  getOriginalLocation,
  getOriginalSourceText,
  applySourceMap,
  clearSourceMaps
};

self.onmessage = function(msg: Message) {
  const { id, method, args } = msg.data;
  const response = publicInterface[method].apply(undefined, args);
  if (response instanceof Promise) {
    response.then(val => self.postMessage({ id, response: val }),
                  err => self.postMessage({ id, error: err }));
  } else {
    self.postMessage({ id, response });
  }
};
