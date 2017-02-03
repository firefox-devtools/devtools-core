const classnames = require("classnames");
require("./Root.css");

module.exports = function(className) {
  const root = document.createElement("div");
  root.className = classnames(className);
  root.style.setProperty("flex", 1);
  return root;
};
