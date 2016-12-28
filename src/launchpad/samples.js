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
    "new Promise()"
  ],

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
