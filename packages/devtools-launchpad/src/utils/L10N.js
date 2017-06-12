/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { sprintf } = require("devtools-sprintf-js");
const { parse } = require("properties-parser");

let strings = {};

function setBundle(bundle: { [key: string]: string }) {
  bundle = parse(bundle);
  strings = Object.assign(strings, bundle);
}

function getStr(key: string) {
  if (!strings[key]) {
    throw new Error(`L10N key ${key} cannot be found.`);
  }
  return strings[key];
}

function getFormatStr(name: string, ...args: any) {
  return sprintf(getStr(name), ...args);
}

function numberWithDecimals(number: number, decimals: number = 0) {
  // If this is an integer, don't do anything special.
  if (number === (number | 0)) {
    return number;
  }
  // If this isn't a number (and yes, `isNaN(null)` is false), return zero.
  if (isNaN(number) || number === null) {
    return "0";
  }

  let localized = number.toLocaleString();

  // If no grouping or decimal separators are available, bail out, because
  // padding with zeros at the end of the string won't make sense anymore.
  if (!localized.match(/[^\d]/)) {
    return localized;
  }

  return number.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
}

module.exports = {
  setBundle,
  getStr,
  getFormatStr,
  numberWithDecimals
};
