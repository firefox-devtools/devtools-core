/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let samples = {
  array: [
    "x = [1, \"2\", {three: 3}, []]",
    "x = []"
  ],

  boolean: [
    "true",
    "false"
  ],

  date: [
    "new Date()"
  ],

  function: [
    "x = () => { 2 }"
  ],

  node: [
    `x = document.createElement("div");
     x.setAttribute("id", "myNodeId");
     x.setAttribute("class", "my-class and another");
     x.textContent = "My node id";
     x;`,
    `x = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
     x.setAttribute("id", "myNodeId");
     x.setAttribute("class", "my-class and another");
     x;`,
    "document.createComment('my comment node')",
    "document.createTextNode('foo')",
    `x = document.createAttribute('foo');
     x.value = "bar";
     x;`
  ],

  "map & sets": [
    `
      ({
        "small set": new Set([1,2,3,4]),
        "small map": new Map([
          ["a", {suba: 1}],
          [{bkey: "b"}, 2]]
        ),
        "medium set": new Set(
          Array.from({length: 20})
            .map((el, i) => ({
              [String.fromCharCode(65 + i)]: i + 1,
              test: {
                [i] : "item" + i
              }
            })
          )),
        "medium map": new Map(
          Array
          .from({length: 20})
          .map((el, i) => [
            {
              [String.fromCharCode(65 + i)]: i + 1,
              test: {[i] : "item" + i, body: document.body}
            },
            Symbol(i + 1)
          ])
        ),
        "large set": new Set(
          Array.from({length: 2000})
          .map((el, i) => ({
            [String.fromCharCode(65 + i)]: i + 1,
            test: {
              [i] : "item" + i
            }
          })
        )),
        "large map": new Map(
          Array
          .from({length: 2000})
          .map((el, i) => [
            {
              [String.fromCharCode(65 + i)]: i + 1,
              document
            },
            Symbol(i + 1)
          ])
        ),
      })
    `
  ],

  number: [
    "1",
    "-1",
    "-3.14",
    "0",
    "-0",
    "Infinity",
    "-Infinity",
    "NaN"
  ],

  object: [
    "x = {a: 2}"
  ],

  promise: [
    "Promise.resolve([1, 2, 3])",
    "Promise.reject(new Error('This is wrong'))",
    "new Promise(() => {})"
  ],

  proxy: [`
    var handler = {
        get: function(target, name) {
            return name in target ?
                target[name] :
                37;
        }
    };
    new Proxy({a: 1}, handler);
  `],

  regexp: [
    "new RegExp('^[-]?[0-9]+[\.]?[0-9]+$')"
  ],

  string: [
    "'foo'",
    "'bar\nbaz\nyup'",
    "'blah'.repeat(10000)"
  ],

  symbol: [
    "Symbol('foo')",
    "Symbol()"
  ]
};

samples.yolo = Object.keys(samples).reduce((res, key) => {
  return [...res, ...samples[key]];
}, []);

module.exports = samples;
