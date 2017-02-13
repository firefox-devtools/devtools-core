#!/usr/bin/env node

const minimist = require("minimist");
const url = require('url');
var path = require('path');
const webdriver = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const isWindows = /^win/.test(process.platform);

addGeckoDriverToPath()

const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

const args = minimist(process.argv.slice(2),
{
  boolean: ["start", "tests", "websocket"],
  string: ["location"],
});

const shouldStart = args.start;
const isTests = args.tests;
const useWebSocket = args.websocket;

function addGeckoDriverToPath() {
  // NOTE: when the launchpad is symlinked we ned to check for
  // geckodriver in a different location
  const isSymLinked = __dirname.match(/devtools-core/);
  const relativeGeckoPath = isSymLinked ?
    '../node_modules/geckodriver' : '../../geckodriver';
  const geckoDriverPath = path.resolve(__dirname, relativeGeckoPath);
  process.env.PATH = `${geckoDriverPath}${path.delimiter}${process.env.PATH}`;
}

function binaryArgs() {
  return [
    (!isWindows ? "-" : "") +
    "-start-debugger-server=" +
    (useWebSocket ? "ws:6080" : "6080")
  ];
}

function firefoxBinary() {
  let binary = new firefox.Binary();

  binary.addArguments(binaryArgs());

  return binary;
}

function firefoxProfile() {
  let profile = new firefox.Profile();

  profile.setPreference("devtools.debugger.remote-port", 6080);
  profile.setPreference("devtools.debugger.remote-enabled", true);
  profile.setPreference("devtools.chrome.enabled", true);
  profile.setPreference("devtools.debugger.prompt-connection", false);
  profile.setPreference("devtools.debugger.remote-websocket", useWebSocket);
  profile.setPreference("javascript.options.asyncstack", true);

  return profile;
}

function start(_url) {
  let options = new firefox.Options();

  options.setProfile(firefoxProfile());
  options.setBinary(firefoxBinary());

  const driver = new webdriver.Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  let location = url.parse(_url);
  if (location.protocol === null) {
    location.protocol = 'http:';
  }
  driver.get(url.format(location));

  return driver;
}

if (shouldStart) {
  const location = args.location || 'about:blank';
  const driver = start(location);
  setInterval(() => {}, 100);
}

function getResults(driver) {
  driver
    .findElement(By.id("mocha-stats"))
    .getText().then(results => {
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
