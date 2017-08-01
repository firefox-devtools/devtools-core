/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */
const accessorStubs = require("../../../reps/stubs/accessor");
const performanceStubs = require("../../stubs/performance");
const gripMapStubs = require("../../../reps/stubs/grip-map");

const {
  createNode,
  getChildren,
  getValue,
  makeNodesForEntries,
  SAFE_PATH_PREFIX,
} = require("../../utils");

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

  it("uses the expected actor to get properties", () => {
    const stub = performanceStubs.get("performance");
    const getObjectProperties = jest.fn();

    // Test that the function gets the actor from the value.
    getChildren({
      actors: {},
      item: createNode(null, "root", "rootpath", stub.ownProperties.timing),
      getObjectProperties
    });
    expect(getObjectProperties.mock.calls[0][0]).toBe("server2.conn4.child1/obj44");

    // Test that the function gets the actor from the getterValue.
    getChildren({
      actors: {},
      item: createNode(null, "root", "rootpath", stub.safeGetterValues.timing),
      getObjectProperties
    });
    expect(getObjectProperties.mock.calls[1][0]).toBe("server2.conn4.child1/obj44");
  });

  it("uses the expected actor to get entries", () => {
    const getObjectEntries = jest.fn();
    const actor = Symbol();
    const mapNode = createNode(null, "map", "/", {value: {actor}});
    // Test that the function gets the actor from the value.
    getChildren({
      actors: {},
      item: makeNodesForEntries(mapNode),
      getObjectEntries
    });
    expect(getObjectEntries.mock.calls[0][0]).toBe(actor);
  });

  it("gets data from the cache when it exists", () => {
    const getObjectEntries = jest.fn();
    const getObjectProperties = jest.fn();
    const mapNode = createNode(null, "map", "rootpath", {
      value: gripMapStubs.get("testSymbolKeyedMap")
    });
    const cachedData = Symbol();
    // Test that the function gets the actor from the value.
    const children = getChildren({
      actors: {
        "rootpath": cachedData
      },
      item: mapNode,
      getObjectEntries,
      getObjectProperties,
    });
    expect(children).toBe(cachedData);
    expect(getObjectEntries.mock.calls.length).toBe(0);
    expect(getObjectProperties.mock.calls.length).toBe(0);
  });

  it("safeGetterValues", () => {
    const stub = performanceStubs.get("timing");
    const nodes = getChildren({
      actors: {},
      item: createNode(null, "root", "rootpath", {
        value: {
          actor: "rootactor",
          type: "object"
        }
      }),
      getObjectProperties: actor => {
        if (actor === "rootactor") {
          return stub;
        }
        return null;
      }
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
});
