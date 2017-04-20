let p = typeof window != "undefined" ? window.Promise : Promise;
p.defer = function defer() {
  var resolve, reject;
  var promise = new Promise(function() {
    resolve = arguments[0];
    reject = arguments[1];
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise,
  };
};

module.exports = p;
