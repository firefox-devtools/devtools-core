/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const accessorStubs = require("../../../reps/stubs/accessor");
const performanceStubs = require("../../stubs/performance");
const gripMapStubs = require("../../../reps/stubs/grip-map");
const gripArrayStubs = require("../../../reps/stubs/grip-array");
const gripMapEntryStubs = require("../../../reps/stubs/grip-map-entry");
const gripStubs = require("../../../reps/stubs/grip");

const {
  createNode,
  getChildren,
  getValue,
  SAFE_PATH_PREFIX,
} = require("../../utils/node");

describe("getChildren", () => {
  it("accessors - getter", () => {
    const nodes = getChildren({
      item: createNode(null, "root", "rootpath", accessorStubs.get("getter"))
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<get>"]);
    expect(paths).toEqual([`rootpath/${SAFE_PATH_PREFIX}get`]);
  });

  it("accessors - setter", () => {
    const nodes = getChildren({
      item: createNode(null, "root", "rootpath", accessorStubs.get("setter"))
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<set>"]);
    expect(paths).toEqual([`rootpath/${SAFE_PATH_PREFIX}set`]);
  });

  it("accessors - getter & setter", () => {
    const nodes = getChildren({
      item: createNode(null, "root", "rootpath", accessorStubs.get("getter setter"))
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<get>", "<set>"]);
    expect(paths).toEqual(
      [`rootpath/${SAFE_PATH_PREFIX}get`, `rootpath/${SAFE_PATH_PREFIX}set`]);
  });

  it("returns the expected nodes for Proxy", () => {
    const nodes = getChildren({
      item: createNode(null, "root", "rootpath", { value: gripStubs.get("testProxy")})
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<target>", "<handler>"]);
    expect(paths).toEqual(
      [`rootpath/${SAFE_PATH_PREFIX}target`, `rootpath/${SAFE_PATH_PREFIX}handler`]);
  });

  it("safeGetterValues", () => {
    const stub = performanceStubs.get("timing");
    const nodes = getChildren({
      item: createNode(null, "root", "rootpath", {
        value: {
          actor: "rootactor",
          type: "object"
        }
      }),
      loadedProperties: new Map([["rootpath", stub]]),
    });

    const nodeEntries = nodes.map(n => [n.name, getValue(n)]);
    const nodePaths = nodes.map(n => n.path);

    const childrenEntries = [
      ["connectEnd", 1500967716401],
      ["connectStart", 1500967716401],
      ["domComplete", 1500967716719],
      ["domContentLoadedEventEnd", 1500967716715],
      ["domContentLoadedEventStart", 1500967716696],
      ["domInteractive", 1500967716552],
      ["domLoading", 1500967716426],
      ["domainLookupEnd", 1500967716401],
      ["domainLookupStart", 1500967716401],
      ["fetchStart", 1500967716401],
      ["loadEventEnd", 1500967716720],
      ["loadEventStart", 1500967716719],
      ["navigationStart", 1500967716401],
      ["redirectEnd", 0],
      ["redirectStart", 0],
      ["requestStart", 1500967716401],
      ["responseEnd", 1500967716401],
      ["responseStart", 1500967716401],
      ["secureConnectionStart", 1500967716401],
      ["unloadEventEnd", 0],
      ["unloadEventStart", 0],
      ["__proto__", stub.prototype]
    ];
    const childrenPaths = childrenEntries.map(([name]) => `rootpath/${name}`);

    expect(nodeEntries).toEqual(childrenEntries);
    expect(nodePaths).toEqual(childrenPaths);
  });

  it("gets data from the cache when it exists", () => {
    const mapNode = createNode(null, "map", "rootpath", {
      value: gripMapStubs.get("testSymbolKeyedMap")
    });
    const cachedData = Symbol();
    const children = getChildren({
      cachedNodes: new Map([["rootpath", cachedData]]),
      item: mapNode,
    });
    expect(children).toBe(cachedData);
  });

  it("returns an empty array if the node does not represent an object", () => {
    const node = createNode(null, "root", "/", {value: 42});
    expect(getChildren({
      item: node
    })).toEqual([]);
  });

  it("returns an empty array if a grip node has no loaded properties", () => {
    const node = createNode(null, "root", "/", {value: gripMapStubs.get("testMaxProps")});
    expect(getChildren({
      item: node,
    })).toEqual([]);
  });

  it("adds children to cache when a grip node has loaded properties", () => {
    const stub = performanceStubs.get("timing");
    const cachedNodes = new Map();

    const children = getChildren({
      cachedNodes,
      item: createNode(null, "root", "/", {
        value: {
          actor: "rootactor",
          type: "object"
        }
      }),
      loadedProperties: new Map([["/", stub]]),
    });
    expect(cachedNodes.get("/")).toBe(children);
  });

  it("adds children to cache when it already has some", () => {
    const cachedNodes = new Map();
    const children = [Symbol()];
    getChildren({
      cachedNodes,
      item: createNode(null, "root", "/", children),
    });
    expect(cachedNodes.get("/")).toBe(children);
  });

  it("adds children to cache on a node with accessors", () => {
    const cachedNodes = new Map();
    const node = createNode(null, "root", "/", accessorStubs.get("getter setter"));
    const children = getChildren({
      cachedNodes,
      item: node,
    });
    expect(cachedNodes.get("/")).toBe(children);
  });

  it("adds children to cache on a map entry node", () => {
    const cachedNodes = new Map();
    const node = createNode(null, "root", "/", {value: gripMapEntryStubs.get("A → 0")});
    const children = getChildren({
      cachedNodes,
      item: node,
    });
    expect(cachedNodes.get("/")).toBe(children);
  });

  it("does not adds children to cache on a proxy node and no loaded props", () => {
    const cachedNodes = new Map();
    const node = createNode(null, "root", "/", {value: gripStubs.get("testProxy")});
    getChildren({
      cachedNodes,
      item: node,
    });
    expect(cachedNodes.has("/")).toBeFalsy();
  });

  it("adds children to cache on a proxy node having loaded props", () => {
    const cachedNodes = new Map();
    const node = createNode(null, "root", "/", {value: gripStubs.get("testProxy")});
    const children = getChildren({
      cachedNodes,
      item: node,
      loadedProperties: new Map([["/", {prototype: {}}]])
    });
    expect(cachedNodes.get("/")).toBe(children);
  });

  it("does not adds children to cache on a node with buckets and no loaded props", () => {
    const cachedNodes = new Map();
    const node = createNode(null, "root", "/", {value: gripArrayStubs.get("Array(234)")});
    getChildren({
      cachedNodes,
      item: node,
    });
    expect(cachedNodes.has("/")).toBeFalsy();
  });

  it("adds children to cache on a node with buckets having loaded props", () => {
    const cachedNodes = new Map();
    const node = createNode(null, "root", "/", {value: gripArrayStubs.get("Array(234)")});
    const children = getChildren({
      cachedNodes,
      item: node,
      loadedProperties: new Map([["/", {prototype: {}}]])
    });
    expect(cachedNodes.get("/")).toBe(children);
  });
});
