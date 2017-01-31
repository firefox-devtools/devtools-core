/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const toolbox = require("devtools-launchpad/index");
const feature = require("devtools-config");
const getConfig = require("./getConfig");
const getValue = require("devtools-config").getValue;
const Mustache = require("mustache");
const isDevelopment = require("devtools-config").isDevelopment;

const fs = require("fs");
const path = require("path");

const envConfig = getConfig();
feature.setConfig(envConfig);

const webpackConfig = require("../webpack.config");
let { app } = toolbox.startDevServer(envConfig, webpackConfig);

/**
 * Serve the root file for launchpad.
 */
app.get("/", (req, res) => {
  const tplPath = path.join(__dirname, "../index.html");
  const tplFile = fs.readFileSync(tplPath, "utf8");
  const bundleName = "bundle";

  res.send(Mustache.render(tplFile, {
    isDevelopment: isDevelopment(),
    dir: getValue("dir") || "ltr",
    bundleName,
    title: getValue("title"),
    favicon: getFavicon()
  }));
});

/**
 * Provide images used in CSS.
 */
function sendFile(res, src, encoding) {
  const filePath = path.join(__dirname, src);
  const file = encoding ? fs.readFileSync(filePath, encoding) :
    fs.readFileSync(filePath);
  res.send(file);
}

app.get("/images/:file.svg", function(req, res) {
  console.log(`Get SVG file: ${req.params.file}`);
  res.contentType("image/svg+xml");
  sendFile(res, `../assets/images/${req.params.file}.svg`, "utf-8");
});

app.get("/images/:file.png", function(req, res) {
  console.log(`Get PNG file: ${req.params.file}`);
  res.contentType("image/png");
  sendFile(res, `../assets/images/${req.params.file}.png`);
});

/**
 * Helpers
 */
function getFavicon() {
  let favicon = getValue("favicon");
  if (!favicon) {
    return "/images/favicon.png";
  }
  return path.basename(favicon);
}
