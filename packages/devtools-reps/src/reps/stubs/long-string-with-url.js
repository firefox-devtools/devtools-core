/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const urlFullText = "http://example.com?param=" + "a".repeat(2000);
const urlFullTextLength = urlFullText.length;
const urlInitialText = urlFullText.substring(0, 1000);

const stubs = new Map();
stubs.set("testLongUrl", {
  "type": "longString",
  "initial": urlInitialText,
  "length": urlFullTextLength,
  "actor": "server1.conn1.child1/longString58"
});

stubs.set("testLongUrlFullText", {
  "type": "longString",
  "fullText": urlFullText,
  "initial": urlFullText,
  "length": urlFullTextLength,
  "actor": "server1.conn1.child1/longString58"
});

module.exports = stubs;
