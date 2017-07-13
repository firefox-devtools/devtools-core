/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function networkRequest(url, opts) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    req.addEventListener("readystatechange", () => {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === 200) {
          resolve({ content: req.responseText });
        } else {
          reject(req.statusText);
        }
      }
    });

    // Not working yet.
    // if (!opts.loadFromCache) {
    //   req.channel.loadFlags = (
    //     Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE |
    //       Components.interfaces.nsIRequest.INHIBIT_CACHING |
    //       Components.interfaces.nsIRequest.LOAD_ANONYMOUS
    //   );
    // }

    req.open("GET", url);
    req.send();
  });
}

module.exports = networkRequest;
