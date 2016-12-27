const React = require("react");
const { DOM: dom, PropTypes } = React;
require("./QuickLinks.css");

const expressions = {
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
     x;
    `,
    `x = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
     x.setAttribute("id", "myNodeId");
     x.setAttribute("class", "my-class and another");
     x;
    `,
    "document.createComment('my comment node')",
    "document.createTextNode('foo')",
    `x = document.createAttribute('foo');
     x.value = "bar";
     x;
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

expressions.yolo = Object.keys(expressions).reduce((res, key) => {
  return [...res, ...expressions[key]];
}, []);

const QuickLinks = React.createClass({

  propTypes: {
    evaluate: PropTypes.function
  },

  displayName: "QuickLinks",

  evaluateExpressions(sampleExpressions) {
    sampleExpressions.forEach(
      expression => this.props.evaluate(expression)
    );
  },

  renderLinks() {
    return Object.keys(expressions).map(label => dom.span(
      {
        key: label,
        "data-expressions-count": expressions[label].length,
        onClick: () => this.evaluateExpressions(expressions[label])
      },
      label
    ));
  },

  render() {
    return dom.div(
      { className: "quick-links" },
      this.renderLinks()
    );
  }
});

module.exports = QuickLinks;
