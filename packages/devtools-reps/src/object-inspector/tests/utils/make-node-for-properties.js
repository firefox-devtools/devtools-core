/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  createNode,
  makeNodesForProperties,
  nodeIsDefaultProperties,
  nodeIsEntries,
  nodeIsMapEntry,
  nodeIsPrototype,
  SAFE_PATH_PREFIX,
} = require("../../utils/node");
const gripArrayStubs = require("../../../reps/stubs/grip-array");

const root = {
  path: "root",
  contents: {
    value: gripArrayStubs.get("testBasic")
  }
};

const objProperties = {
  ownProperties: {
    "0": {
      value: {}
    },
    "2": {},
    length: {
      value: 3
    }
  },
  prototype: {
    type: "object",
    actor: "server2.conn1.child1/pausedobj618",
    class: "bla"
  }
};

describe("makeNodesForProperties", () => {
  it("kitchen sink", () => {
    const nodes = makeNodesForProperties(objProperties, root);

    const names = nodes.map(n => n.name);
    expect(names).toEqual(["0", "length", "__proto__"]);

    const paths = nodes.map(n => n.path);
    expect(paths).toEqual(["root/0", "root/length", "root/__proto__"]);
  });

  it("includes getters and setters", () => {
    const nodes = makeNodesForProperties(
      {
        ownProperties: {
          foo: { value: "foo" },
          bar: {
            "get": {
              "type": "object",
            },
            "set": {
              "type": "undefined"
            }
          },
          baz: {
            "get": {
              "type": "undefined"
            },
            "set": {
              "type": "object",
            }
          }
        },
        prototype: {
          class: "bla"
        }
      },
      root
    );

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["bar", "baz", "foo", "__proto__"]);
    expect(paths).toEqual(["root/bar", "root/baz", "root/foo", "root/__proto__"]);
  });

  it("sorts keys", () => {
    const nodes = makeNodesForProperties(
      {
        ownProperties: {
          bar: { value: {} },
          1: { value: {} },
          11: { value: {} },
          2: { value: {} },
          _bar: { value: {} }
        },
        prototype: {
          class: "bla"
        }
      },
      root
    );

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["1", "2", "11", "_bar", "bar", "__proto__"]);
    expect(paths).toEqual([
      "root/1",
      "root/2",
      "root/11",
      "root/_bar",
      "root/bar",
      "root/__proto__"
    ]);
  });

  it("prototype is included", () => {
    const nodes = makeNodesForProperties(
      {
        ownProperties: {
          bar: { value: {} }
        },
        prototype: { value: {}, class: "bla" }
      },
      root
    );

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["bar", "__proto__"]);
    expect(paths).toEqual(["root/bar", "root/__proto__"]);

    expect(nodeIsPrototype(nodes[1])).toBe(true);
  });

  it("window object", () => {
    const nodes = makeNodesForProperties(
      {
        ownProperties: {
          bar: { value: {} },
          location: { value: {} }
        },
        class: "Window"
      },
      {
        path: "root",
        contents: { value: { class: "Window" } }
      }
    );

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["bar", "[default properties]"]);
    expect(paths).toEqual(["root/bar", "root/##-default"]);

    expect(nodeIsDefaultProperties(nodes[1])).toBe(true);
  });

  it("object with entries", () => {
    const gripMapStubs = require("../../../reps/stubs/grip-map");

    const mapNode = createNode(null, "map", "root", {
      value: gripMapStubs.get("testSymbolKeyedMap")
    });

    const nodes = makeNodesForProperties({
      ownProperties: {
        size: {value: 1},
        custom: {value: "customValue"}
      }
    }, mapNode);

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["custom", "size", "<entries>"]);
    expect(paths).toEqual([
      "root/custom",
      "root/size",
      `root/${SAFE_PATH_PREFIX}entries`
    ]);

    const entriesNode = nodes[2];
    expect(nodeIsEntries(entriesNode)).toBe(true);

    const children = entriesNode.contents;

    // There are 2 entries in the map.
    expect(children.length).toBe(2);
    // And the 2 nodes created are typed as map entries.
    expect(children.every(child => nodeIsMapEntry(child))).toBe(true);

    const childrenNames = children.map(n => n.name);
    const childrenPaths = children.map(n => n.path);
    expect(childrenNames).toEqual([0, 1]);
    expect(childrenPaths).toEqual([
      `root/${SAFE_PATH_PREFIX}entries/0`,
      `root/${SAFE_PATH_PREFIX}entries/1`
    ]);
  });

  it("quotes property names", () => {
    const nodes = makeNodesForProperties(
      {
        ownProperties: {
          // Numbers are ok.
          332217: { value: {} },
          "needs-quotes": { value: {} },
          unquoted: { value: {} },
          "": { value: {} }
        },
        prototype: {
          class: "WindowPrototype"
        }
      },
      root
    );

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual([
      '""',
      "332217",
      '"needs-quotes"',
      "unquoted",
      "__proto__"
    ]);
    expect(paths).toEqual([
      "root/",
      "root/332217",
      "root/needs-quotes",
      "root/unquoted",
      "root/__proto__"
    ]);
  });
});
