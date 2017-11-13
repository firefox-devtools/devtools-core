const React = require("react");
const { default: InlineSVG } = require("svg-inline-react");
const { isDevelopment } = require("devtools-config");

const svg = {
  rocket: require("./rocket.svg")
};

type SvgType = {
  name: string,
  className?: string,
  onClick?: () => void,
  "aria-label"?: string
};

function Svg({ name, className, onClick, "aria-label": ariaLabel }) {
  className = `${name} ${className || ""}`;

  const props = {
    className,
    onClick,
    ["aria-label"]: ariaLabel,
    src: svg[name]
  };

  return <InlineSVG {...props} />;
}

Svg.displayName = "Svg";

module.exports = Svg;
