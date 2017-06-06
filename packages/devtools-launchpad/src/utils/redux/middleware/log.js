/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A middleware that logs all actions coming through the system
 * to the console.
 */
function log({ dispatch, getState }) {
  return next => action => {
    const actionText = JSON.stringify(action, null, 2);
    const truncatedActionText = `${actionText.slice(0, 1000) }...`;
    console.log(`[DISPATCH ${action.type}]`, action, truncatedActionText);
    next(action);
  };
}

exports.log = log;
