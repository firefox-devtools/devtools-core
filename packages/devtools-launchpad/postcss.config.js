/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var mapUrl = require("postcss-url-mapper");

const urls = ["chrome://", "resource://"];

const urlRegex = new RegExp(`(${urls.join("|")})`);

function _mapUrl(url) {
  const newUrl = url
    .replace(urlRegex, "/assets/")
    .replace(/devtools\/skin/, "devtools/client/themes")
    .replace(/devtools\/content/, "devtools/client");
  return newUrl;
}

module.exports = {
  plugins: [
    require("postcss-bidirection"),
    require("autoprefixer"),
    require("postcss-class-namespace")(),
    mapUrl(_mapUrl)
  ]
};
