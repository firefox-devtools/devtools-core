/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const ps = require("child_process");
const path = require("path");
const { isFirefoxRunning } = require("./utils/firefox");
const firefoxDriver = require("../../bin/firefox-driver");

function handleLaunchRequest(req, res) {
  const browser = req.body.browser;
  const location = "https://devtools-html.github.io/debugger-examples/";

  process.env.PATH += `:${__dirname}`;
  if (browser == "Firefox") {
    isFirefoxRunning().then((isRunning) => {
      console.log("running", isRunning);
      if (!isRunning) {
        firefoxDriver.start(location);
        res.end("launched firefox");
      } else {
        res.end("already running firefox");
      }
    });
  }

  if (browser == "Chrome") {
    ps.spawn(path.resolve(__dirname, "../../bin/chrome-driver.js"),
     ["--location", location]);
    res.end("launched chrome");
  }
}

module.exports = {
  handleLaunchRequest
};
