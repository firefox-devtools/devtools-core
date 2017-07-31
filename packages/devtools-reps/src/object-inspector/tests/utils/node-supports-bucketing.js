/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  createNode,
  nodeSupportsBucketing,
} = require("../../utils");

const createRootNode = (stub) => createNode(
  null,
  "root",
  "rootpath", {
   value: stub
  }
);

const gripArrayStubs = require("../../../reps/stubs/grip-array");

describe("nodeSupportsBucketing", () => {
  it("returns true for Arrays", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testBasic"))
    )).toBe(true);
  });

  // Should pass (see https://github.com/devtools-html/devtools-core/issues/496)
  it.skip("returns true for NodeMap", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testNamedNodeMap"))
    )).toBe(true);
  });

  // Should pass (see https://github.com/devtools-html/devtools-core/issues/496)
  it.skip("returns true for NodeList", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testNodeList"))
    )).toBe(true);
  });

  // Should pass (see https://github.com/devtools-html/devtools-core/issues/496)
  it.skip("returns true for DocumentFragment", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testDocumentFragment"))
    )).toBe(true);
  });

  // Should pass when https://github.com/devtools-html/devtools-core/issues/494 is fixed.
  it.skip("returns true for Maps", () => {
  });

  // Should pass when https://github.com/devtools-html/devtools-core/issues/494 is fixed.
  it.skip("returns true for Sets", () => {
  });

  // Should pass when https://github.com/devtools-html/devtools-core/issues/494 is fixed.
  it.skip("returns true for WeakMaps", () => {
  });

  // Should pass when https://github.com/devtools-html/devtools-core/issues/494 is fixed.
  it.skip("returns true for WeakSets", () => {
  });
});
