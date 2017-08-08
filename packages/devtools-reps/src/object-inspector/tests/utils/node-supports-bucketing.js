/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  createNode,
  makeNodesForEntries,
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
const gripMapStubs = require("../../../reps/stubs/grip-map");

describe("nodeSupportsBucketing", () => {
  it("returns true for Arrays", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testBasic"))
    )).toBe(true);
  });

  it("returns true for NodeMap", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testNamedNodeMap"))
    )).toBe(true);
  });

  it("returns true for NodeList", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testNodeList"))
    )).toBe(true);
  });

  it("returns true for DocumentFragment", () => {
    expect(nodeSupportsBucketing(
      createRootNode(gripArrayStubs.get("testDocumentFragment"))
    )).toBe(true);
  });

  it("returns true for <entries> node", () => {
    expect(nodeSupportsBucketing(
      makeNodesForEntries(createRootNode(gripMapStubs.get("testSymbolKeyedMap")))
    )).toBe(true);
  });
});
