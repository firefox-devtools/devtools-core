const React = require("react");
const InlineSVG = require("svg-inline-react");

const svg = {
  "open-inspector": require("./open-inspector.svg"),
};

module.exports = function(name, props) { // eslint-disable-line
  if (!svg[name]) {
    throw new Error("Unknown SVG: " + name);
  }
  let className = name;
  if (props && props.className) {
    className = `${name} ${props.className}`;
  }
  if (name === "subSettings") {
    className = "";
  }
  props = Object.assign({}, props, { className, src: svg[name] });
  return React.createElement(InlineSVG, props);
};
