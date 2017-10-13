const React = require("react");
const InlineSVG = require("svg-inline-react");
const { isDevelopment } = require("devtools-config");

const svg = {
  "rocket": require("./rocket.svg")
};

function Svg({ name, className, onClick, "aria-label": ariaLabel }) {
  className = `${name} ${className || ""}`;
  if (name === "subSettings") {
    className = "";
  }

  const props = {
    className,
    onClick,
    ["aria-label"]: ariaLabel,
    src: svg[name]
  };

  return React.createElement(InlineSVG, props);
}

Svg.displayName = "Svg";

module.exports = Svg;
