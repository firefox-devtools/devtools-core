/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const classnames = require("classnames");
require("./Root.css");

module.exports = function (className) {
  const root = document.createElement("div");
  root.className = classnames(className);
  root.style.setProperty("flex", 1);
  return root;
};
