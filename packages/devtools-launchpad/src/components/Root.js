const classnames = require("classnames");
const { getValue, isDevelopment } = require("devtools-config");

require("./Root.css");

function themeClass() {
  const theme = getValue("theme");
  return `theme-${theme}`;
}

const rootClass = classnames("theme-body", { [themeClass()]: isDevelopment() });

module.exports = function(className) {
  const root = document.createElement("div");
  root.className = classnames(rootClass, className);
  root.style.setProperty("flex", 1);
  return root;
};
