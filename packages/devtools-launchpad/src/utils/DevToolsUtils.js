/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require("./assert");

function reportException(who, exception) {
  let msg = `${who} threw an exception: `;
  console.error(msg, exception);
}

function executeSoon(fn) {
  setTimeout(fn, 0);
}

module.exports = {
  reportException,
  executeSoon,
  assert
};
