/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */
const accessorStubs = require("../../../reps/stubs/accessor");
const performanceStubs = require("../../stubs/performance");

const {
  createNode,
  getChildren,
  getValue,
} = require("../../utils");

describe("getChildren", () => {
  it("accessors - getter", () => {
    const nodes = getChildren({
      item: createNode("root", "rootpath", accessorStubs.get("getter"))
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<get>"]);
    expect(paths).toEqual(["rootpath/get"]);
  });

  it("accessors - setter", () => {
    const nodes = getChildren({
      item: createNode("root", "rootpath", accessorStubs.get("setter"))
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<set>"]);
    expect(paths).toEqual(["rootpath/set"]);
  });

  it("accessors - getter & setter", () => {
    const nodes = getChildren({
      item: createNode("root", "rootpath", accessorStubs.get("getter setter"))
    });

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["<get>", "<set>"]);
    expect(paths).toEqual(["rootpath/get", "rootpath/set"]);
  });

  it("uses the expected actor to get properties", () => {
    const stub = performanceStubs.get("performance");
    const getObjectProperties = jest.fn();

    // Test that the function gets the actor from the value.
    getChildren({
      actors: {},
      item: createNode("root", "rootpath", stub.ownProperties.timing),
      getObjectProperties
    });
    expect(getObjectProperties.mock.calls[0][0]).toBe("server2.conn4.child1/obj44");

    // Test that the function gets the actor from the getterValue.
    getChildren({
      actors: {},
      item: createNode("root", "rootpath", stub.safeGetterValues.timing),
      getObjectProperties
    });
    expect(getObjectProperties.mock.calls[1][0]).toBe("server2.conn4.child1/obj44");
  });

  it("safeGetterValues", () => {
    const stub = performanceStubs.get("timing");
    const nodes = getChildren({
      actors: {},
      item: createNode("root", "rootpath", {
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
