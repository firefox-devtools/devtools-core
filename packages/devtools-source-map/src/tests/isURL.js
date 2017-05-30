/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { isURL } = require("../path");

test("isURL", () => {
  expect(isURL("http://www.example.com/")).toEqual(true);
  expect(isURL("www.example.com/")).toEqual(false);
  expect(isURL("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D")).toEqual(true);
});
