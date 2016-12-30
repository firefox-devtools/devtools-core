/**
 * Returns an object with a promise and its resolve and reject function,
 * so they can be called outside of the promise callback.
 *
 * @returns {{resolve: function, reject: function, promise: Promise}}
 */
function defer() {
  let resolve, reject;
  let promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise
  };
}

/**
 * Takes a function and executes it on the next tick.
 *
 * @param function fn
 */
function executeSoon(fn) {
  setTimeout(fn, 0);
}

/**
 * Takes an object into another object,
 * filtered on its keys by the given predicate.
 *
 * @param object obj
 * @param function predicate
 * @returns object
 */
function filterByKey(obj, predicate) {
  return Object.keys(obj)
    .reduce((res, key) => {
      if (predicate(key)) {
        return Object.assign(res, {[key]: obj[key]});
      }
      return res;
    }, {});
}

let keyCounter = 0;
function generateKey() {
  return `${++keyCounter}`;
}

module.exports = {
  defer,
  executeSoon,
  filterByKey,
  generateKey,
};
