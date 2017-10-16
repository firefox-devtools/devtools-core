/**
 * Converts an object into an array with 2-element arrays as key/value
 * pairs of the object. `{ foo: 1, bar: 2}` would become
 * `[[foo, 1], [bar 2]]` (order not guaranteed);
 *
 * @param object obj
 * @returns array
 */
function entries(obj: any) {
  return Object.keys(obj).map(k => [k, obj[k]]);
}

function mapObject(obj: any, iteratee: any) {
  return toObject(
    entries(obj).map(([key, value]) => {
      return [key, iteratee(key, value)];
    })
  );
}

/**
 * Takes an array of 2-element arrays as key/values pairs and
 * constructs an object using them.
 */
function toObject(arr: any) {
  const obj = {};
  for (let pair of arr) {
    obj[pair[0]] = pair[1];
  }
  return obj;
}

module.exports = {
  entries,
  toObject
};
