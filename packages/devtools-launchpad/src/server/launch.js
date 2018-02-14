/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const ps = require("child_process");
const path = require("path");
const { isFirefoxRunning } = require("./utils/firefox");
const firefoxDriver = require("../../bin/firefox-driver");
const {
  getValue
} = require("devtools-config");

function handleLaunchRequest(req, res) {
  const browser = req.body.browser;
  const location = getValue("defaultURL");

  process.env.PATH += `:${__dirname}`;
  if (browser == "Firefox") {
    isFirefoxRunning().then((isRunning) => {
      const options = {
        useWebSocket: getValue("firefox.webSocketConnection"),
        webSocketPort: getValue("firefox.webSocketPort"),
        tcpPort: getValue("firefox.tcpPort")
      };
      if (!isRunning) {
        firefoxDriver.start(location, options);
        res.end("launched firefox");
      } else {
        res.end("already running firefox");
      }
    });
  }

  if (browser == "Chrome") {
    const chromeDriver = path.resolve(__dirname, "../../bin/chrome-driver.js");
    ps.spawn("node", [chromeDriver, "--location", location]);
    res.end("launched chrome");
  }
}

module.exports = {
  handleLaunchRequest
};
