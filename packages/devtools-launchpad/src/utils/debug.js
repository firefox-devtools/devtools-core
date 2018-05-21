/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { isDevelopment, isTesting } = require("devtools-environment");

function debugGlobal(field, value) {
  if (isDevelopment() || isTesting()) {
    window[field] = value;
  }
}

module.exports = {
  debugGlobal
};
