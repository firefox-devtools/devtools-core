/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  nodeIsDefault,
  makeNodesForProperties,
  SAFE_PATH_PREFIX,
} = require("../../utils");

const root = {
  path: "root",
  contents: { value: {
    class: "Array"
  }}
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
  });

  it("window prop on normal object", () => {
    const windowRoots = [
      {
        contents: { value: { class: "Window" } }
      }
    ];

    const objectRoots = [
      {
        contents: { value: { class: "Object" } }
      }
    ];

    const item = { name: "location" };

    expect(nodeIsDefault(item, windowRoots)).toEqual(true);
    expect(nodeIsDefault(item, objectRoots)).toEqual(false);
  });

  // For large arrays
  it("numerical buckets", () => {
    let objProps = { ownProperties: {}, prototype: {} };
    for (let i = 0; i < 331; i++) {
      objProps.ownProperties[i] = { value: {} };
    }
    const nodes = makeNodesForProperties(objProps, root);

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual([
      "[0..99]",
      "[100..199]",
      "[200..299]",
      "[300..331]",
      "__proto__"
    ]);

    expect(paths).toEqual([
      `root/${SAFE_PATH_PREFIX}bucket1`,
      `root/${SAFE_PATH_PREFIX}bucket2`,
      `root/${SAFE_PATH_PREFIX}bucket3`,
      `root/${SAFE_PATH_PREFIX}bucket4`,
      "root/__proto__"
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
