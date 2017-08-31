/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const gripArrayStubs = require("../../../reps/stubs/grip-array");
const gripMapStubs = require("../../../reps/stubs/grip-map");

const {
  createNode,
  nodeHasAllEntriesInPreview,
} = require("../../utils/node");

const createRootNode = value => createNode(null, "root", "/", {value});
describe("nodeHasEntries", () => {
  it("returns true when expected", () => {
    expect(nodeHasAllEntriesInPreview(
      createRootNode(gripMapStubs.get("testSymbolKeyedMap")))
    ).toBe(true);

    expect(nodeHasAllEntriesInPreview(
      createRootNode(gripMapStubs.get("testWeakMap"))
    )).toBe(true);

    expect(nodeHasAllEntriesInPreview(
      createRootNode(gripArrayStubs.get("new Set([1,2,3,4])")))
    ).toBe(true);
  });

  it("returns false when expected", () => {
    expect(nodeHasAllEntriesInPreview(
      createRootNode(gripMapStubs.get("testMoreThanMaxEntries"))
    )).toBe(false);

    expect(nodeHasAllEntriesInPreview(
      createRootNode(
        gripArrayStubs.get("new WeakSet(document.querySelectorAll('div, button'))")
      )
    )).toBe(false);
  });
});
