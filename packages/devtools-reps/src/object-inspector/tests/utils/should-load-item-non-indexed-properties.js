/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  createNode,
  getChildren,
  makeNodesForEntries,
  nodeIsDefaultProperties,
  shouldLoadItemNonIndexedProperties,
} = require("../../utils/node");

const GripMapEntryRep = require("../../../reps/grip-map-entry");
const accessorStubs = require("../../../reps/stubs/accessor");
const gripMapStubs = require("../../../reps/stubs/grip-map");
const gripArrayStubs = require("../../../reps/stubs/grip-array");
const gripStubs = require("../../../reps/stubs/grip");
const windowStubs = require("../../../reps/stubs/window");

describe("shouldLoadItemNonIndexedProperties", () => {
  it("returns true for an array", () => {
    const node = createNode(null, "root", "/", {
      value: gripArrayStubs.get("testMaxProps")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeTruthy();
  });

  it("returns false for an already loaded item", () => {
    const node = createNode(null, "root", "/", {
      value: gripArrayStubs.get("testMaxProps")
    });
    const loadedProperties = new Map([[node.path, true]]);
    expect(shouldLoadItemNonIndexedProperties(node, loadedProperties)).toBeFalsy();
  });

  it("returns true for an array node with buckets", () => {
    const node = createNode(null, "root", "/", {
      value: gripArrayStubs.get("Array(234)")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeTruthy();
  });

  it("returns false for an array bucket node", () => {
    const node = createNode(null, "root", "/", {
      value: gripArrayStubs.get("Array(234)")
    });
    const bucketNodes = getChildren({item: node});

    // Make sure we do have a bucket.
    expect(bucketNodes[0].name).toBe("[0…99]");
    expect(shouldLoadItemNonIndexedProperties(bucketNodes[0])).toBeFalsy();
  });

  it("returns false for an entries node", () => {
    const mapStubNode = createNode(null, "map", "/", {
      value: gripMapStubs.get("20-entries Map")
    });
    const entriesNode = makeNodesForEntries(mapStubNode);
    expect(shouldLoadItemNonIndexedProperties(entriesNode)).toBeFalsy();
  });

  it("returns true for an Object", () => {
    const node = createNode(null, "root", "/", {
      value: gripStubs.get("testMaxProps")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeTruthy();
  });

  it("returns true for a Map", () => {
    const node = createNode(null, "root", "/", {
      value: gripMapStubs.get("20-entries Map")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeTruthy();
  });

  it("returns true for a Set", () => {
    const node = createNode(null, "root", "/", {
      value: gripArrayStubs.get("new Set([1,2,3,4])")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeTruthy();
  });

  it("returns true for a Window", () => {
    const node = createNode(null, "root", "/", {
      value: windowStubs.get("Window")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeTruthy();
  });

  it("returns false for a [default properties] node", () => {
    const windowNode = createNode(null, "root", "/", {
      value: windowStubs.get("Window")
    });
    const loadedProperties = new Map([[
      "/",
      {
        ownProperties: {
          foo: {value: "bar"},
          location: {value: "a"},
        }
      }
    ]]);
    const [, defaultPropertiesNode] = getChildren({item: windowNode, loadedProperties});
    expect(nodeIsDefaultProperties(defaultPropertiesNode)).toBe(true);
    expect(shouldLoadItemNonIndexedProperties(defaultPropertiesNode)).toBeFalsy();
  });

  it("returns false for a MapEntry node", () => {
    const node = GripMapEntryRep.createGripMapEntry("key", "value");
    expect(shouldLoadItemNonIndexedProperties(node)).toBeFalsy();
  });

  it("returns false for a Proxy node", () => {
    const node = createNode(null, "root", "/", {
      value: gripStubs.get("testProxy")
    });
    expect(shouldLoadItemNonIndexedProperties(node)).toBeFalsy();
  });

  it("returns true for a Proxy target node", () => {
    const proxyNode = createNode(null, "root", "/", {
      value: gripStubs.get("testProxy")
    });
    const [targetNode] = getChildren({item: proxyNode});
    // Make sure we have the target node.
    expect(targetNode.name).toBe("<target>");
    expect(shouldLoadItemNonIndexedProperties(targetNode)).toBeTruthy();
  });

  it("returns false for an accessor node", () => {
    const accessorNode = createNode(null, "root", "/", {
      value: accessorStubs.get("getter")
    });
    expect(shouldLoadItemNonIndexedProperties(accessorNode)).toBeFalsy();
  });

  it("returns true for an accessor <get> node", () => {
    const accessorNode = createNode(null, "root", "/", accessorStubs.get("getter"));
    const [getNode] = getChildren({item: accessorNode});
    expect(getNode.name).toBe("<get>");
    expect(shouldLoadItemNonIndexedProperties(getNode)).toBeTruthy();
  });

  it("returns true for an accessor <set> node", () => {
    const accessorNode = createNode(null, "root", "/", accessorStubs.get("setter"));
    const [setNode] = getChildren({item: accessorNode});
    expect(setNode.name).toBe("<set>");
    expect(shouldLoadItemNonIndexedProperties(setNode)).toBeTruthy();
  });

  it("returns false for a primitive node", () => {
    const node = createNode(null, "root", "/", {value: 42});
    expect(shouldLoadItemNonIndexedProperties(node)).toBeFalsy();
  });
});
