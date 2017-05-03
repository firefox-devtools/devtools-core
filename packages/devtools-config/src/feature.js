const pick = require("lodash/get");
const put = require("lodash/set");
const fs = require("fs");
const path = require("path");

let config;

const flag = require("./test-flag");

/**
 * Gets a config value for a given key
 * e.g "chrome.webSocketPort"
 */
function getValue(key) {
  return pick(config, key);
}

function setValue(key, value) {
  return put(config, key, value);
}

function isEnabled(key) {
  return config.features && typeof config.features[key] == "object"
    ? config.features[key].enabled
    : config.features[key];
}

function isDevelopment() {
  if (typeof window == "object") {
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    const href = window.location ? window.location.href : "";
    return href.match(/^file:/) || href.match(/localhost:/);
  }

  if (isFirefoxPanel()) {
    // Default to production if compiling for the Firefox panel
    return process.env.NODE_ENV === "development";
  }
  return process.env.NODE_ENV !== "production";
}

function isTesting() {
  return flag.testing;
}

function isFirefoxPanel() {
  return process.env.TARGET == "firefox-panel";
}

function isApplication() {
  return process.env.TARGET == "application";
}

function isFirefox() {
  return /firefox/i.test(navigator.userAgent);
}

function setConfig(value) {
  config = value;
}

function getConfig() {
  return config;
}

function updateLocalConfig(relativePath) {
  const localConfigPath = path.resolve(relativePath, "../configs/local.json");
  const output = JSON.stringify(config, null, 2);
  fs.writeFileSync(localConfigPath, output, { flag: "w" });
  return output;
}

module.exports = {
  isEnabled,
  getValue,
  setValue,
  isDevelopment,
  isTesting,
  isFirefoxPanel,
  isApplication,
  isFirefox,
  getConfig,
  setConfig,
  updateLocalConfig,
};
