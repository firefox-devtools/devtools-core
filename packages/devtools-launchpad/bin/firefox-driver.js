#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const minimist = require("minimist");
const url = require("url");
var path = require("path");
const webdriver = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const isWindows = /^win/.test(process.platform);

addGeckoDriverToPath();

const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

const args = minimist(process.argv.slice(2), {
  boolean: ["start", "tests", "websocket"],
  string: ["location"]
});

const shouldStart = args.start;
const isTests = args.tests;
let useWebSocket = args.websocket;
let connectionPort = 6080;

function addGeckoDriverToPath() {
  // NOTE: when the launchpad is symlinked we ned to check for
  // geckodriver in a different location
  const isSymLinked = __dirname.match(/devtools-core/);
  const relativeGeckoPath = isSymLinked
    ? "../node_modules/geckodriver"
    : "../../geckodriver";
  const geckoDriverPath = path.resolve(__dirname, relativeGeckoPath);
  process.env.PATH = `${geckoDriverPath}${path.delimiter}${process.env.PATH}`;
}

function binaryArgs() {
  const connectionString = useWebSocket
    ? `ws:${connectionPort}`
    : `${connectionPort}`;
  if (isWindows) {
    return ["-start-debugger-server", connectionString]; // e.g. -start-debugger-server 6080
  } else {
    return ["--start-debugger-server=" + connectionString]; // e.g. --start-debugger-server=6080
  }
}

function firefoxBinary() {
  let binary = new firefox.Binary();

  binary.addArguments(binaryArgs());

  return binary;
}

function firefoxProfile() {
  let profile = new firefox.Profile();

  profile.setPreference("devtools.debugger.remote-port", connectionPort);
  profile.setPreference("devtools.debugger.remote-enabled", true);
  profile.setPreference("devtools.chrome.enabled", true);
  profile.setPreference("devtools.debugger.prompt-connection", false);
  profile.setPreference("devtools.debugger.remote-websocket", useWebSocket);
  profile.setPreference("javascript.options.asyncstack", true);

  return profile;
}

function start(_url, _options = {}) {
  if (_options.useWebSocket) {
    useWebSocket = true;
    connectionPort = _options.webSocketPort
      ? _options.webSocketPort
      : connectionPort;
  } else {
    connectionPort = _options.tcpPort ? _options.tcpPort : connectionPort;
  }

  let options = new firefox.Options();

  let nightlyChannel = new firefox.Channel(
    "/Applications/Firefox Nightly.app/Contents/MacOS/firefox-bin",
    "Firefox Nightly\\firefox.exe"
  )

  options.setProfile(firefoxProfile());
  options.setBinary(nightlyChannel);
  options.args_ = binaryArgs();

  const driver = new webdriver.Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  let location = url.parse(_url);
  if (location.protocol === null) {
    location.protocol = "http:";
  }
  driver.get(url.format(location));

  return driver;
}

if (shouldStart) {
  start(args.location || "about:blank");
  setInterval(() => {}, 100);
}

function getResults(driver) {
  driver
    .findElement(By.id("mocha-stats"))
    .getText()
    .then(results => {
      console.log("results ", results);
      const match = results.match(/failures: (\d*)/);
      const resultCode = parseInt(match[1], 10) > 0 ? 1 : 0;
      process.exit(resultCode);
    });
}

if (isTests) {
  const driver = start();
  driver.get("http://localhost:8003");
  setTimeout(() => getResults(driver), 5000);
}

module.exports = { start, By, Key, until };
