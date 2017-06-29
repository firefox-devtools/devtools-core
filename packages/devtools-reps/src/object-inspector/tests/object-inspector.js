/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../index"));
const { MODE } = require("../../reps/constants");
const { Rep } = require("../../reps/rep");
const gripStubs = require("../../reps/stubs/grip");

const {
  getPromiseProperties,
  isDefault,
  isPromise,
  makeNodesForProperties,
} = require("../utils");

const root = {
  path: "root",
  contents: { value: {} }
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

  it("excludes getters", () => {
    const nodes = makeNodesForProperties(
      {
        ownProperties: {
          foo: { value: "foo" },
          bar: {}
        },
        prototype: {
          class: "bla"
        }
      },
      root
    );

    const names = nodes.map(n => n.name);
    const paths = nodes.map(n => n.path);

    expect(names).toEqual(["foo", "__proto__"]);
    expect(paths).toEqual(["root/foo", "root/__proto__"]);
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

    expect(isDefault(item, windowRoots)).toEqual(true);
    expect(isDefault(item, objectRoots)).toEqual(false);
  });

  // For large arrays
  it("numerical buckets", () => {
    let objProps = { ownProperties: {}, prototype: { class: "Array" } };
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
      "root/bucket1",
      "root/bucket2",
      "root/bucket3",
      "root/bucket4",
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

describe("promises utils function", () => {
  it("is promise", () => {
    const promise = {
      contents: {
        enumerable: true,
        configurable: false,
        value: {
          frozen: false,
          ownPropertyLength: 0,
          preview: {
            kind: "Object",
            ownProperties: {},
            ownPropertiesLength: 0,
            safeGetterValues: {}
          },
          actor: "server2.conn2.child1/pausedobj36",
          promiseState: {
            state: "rejected",
            reason: {
              type: "undefined"
            },
            creationTimestamp: 1486584316133.3994,
            timeToSettle: 0.001713000237941742
          },
          class: "Promise",
          type: "object",
          extensible: true,
          sealed: false
        },
        writable: true
      }
    };

    expect(isPromise(promise)).toEqual(true);
  });

  it("getPromiseProperties", () => {
    const promise = {
      path: "root",
      contents: {
        enumerable: true,
        configurable: false,
        value: {
          frozen: false,
          ownPropertyLength: 0,
          preview: {
            kind: "Object",
            ownProperties: {},
            ownPropertiesLength: 0,
            safeGetterValues: {}
          },
          actor: "server2.conn2.child1/pausedobj36",
          promiseState: {
            state: "rejected",
            reason: {
              type: "3"
            },
            creationTimestamp: 1486584316133.3994,
            timeToSettle: 0.001713000237941742
          },
          class: "Promise",
          type: "object",
          extensible: true,
          sealed: false
        },
        writable: true
      }
    };

    const properties = getPromiseProperties(promise);
    expect(properties).toMatchSnapshot();
  });
});

describe("ObjectInspector", () => {
  it("renders as expected", () => {
    const stub = gripStubs.get("testMoreThanMaxProps");

    const renderObjectInspector = mode => mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode,
    }));
    const renderRep = mode => Rep({object: stub, mode});

    const tinyOi = renderObjectInspector(MODE.TINY);
    expect(tinyOi.find(".arrow").exists()).toBeTruthy();
    expect(tinyOi.contains(renderRep(MODE.TINY))).toBeTruthy();

    const shortOi = renderObjectInspector(MODE.SHORT);
    expect(shortOi.find(".arrow").exists()).toBeTruthy();
    expect(shortOi.contains(renderRep(MODE.SHORT))).toBeTruthy();

    const longOi = renderObjectInspector(MODE.LONG);
    expect(longOi.find(".arrow").exists()).toBeTruthy();
    expect(longOi.contains(renderRep(MODE.LONG))).toBeTruthy();

    const oi = renderObjectInspector();
    expect(oi.find(".arrow").exists()).toBeTruthy();
    // When no mode is provided, it defaults to TINY mode to render the Rep.
    expect(oi.contains(renderRep(MODE.TINY))).toBeTruthy();
  });

  it("directly renders a Rep with the stub is not expandable", () => {
    const object = 42;

    const renderObjectInspector = mode => mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        contents: {
          value: object
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode,
    }));
    const renderRep = mode => mount(Rep({object, mode}));

    const tinyOi = renderObjectInspector(MODE.TINY);
    expect(tinyOi.find(".arrow").exists()).toBeFalsy();
    expect(tinyOi.html()).toEqual(renderRep(MODE.TINY).html());

    const shortOi = renderObjectInspector(MODE.SHORT);
    expect(shortOi.find(".arrow").exists()).toBeFalsy();
    expect(shortOi.html()).toEqual(renderRep(MODE.SHORT).html());

    const longOi = renderObjectInspector(MODE.LONG);
    expect(longOi.find(".arrow").exists()).toBeFalsy();
    expect(longOi.html()).toEqual(renderRep(MODE.LONG).html());

    const oi = renderObjectInspector();
    expect(oi.find(".arrow").exists()).toBeFalsy();
    // When no mode is provided, it defaults to TINY mode to render the Rep.
    expect(oi.html()).toEqual(renderRep(MODE.TINY).html());
  });

  it("renders as expected when provided a name", () => {
    const object = gripStubs.get("testMoreThanMaxProps");
    const name = "myproperty";

    const oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        name,
        contents: {
          value: object
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode: MODE.SHORT,
    }));

    expect(oi.find(".object-label").text()).toEqual(name);
  });

  it("renders as expected when not provided a name", () => {
    const object = gripStubs.get("testMoreThanMaxProps");

    const oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        contents: {
          value: object
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode: MODE.SHORT,
    }));

    expect(oi.find(".object-label").exists()).toBeFalsy();
  });

  it("renders leaves with a shorter mode than the root", () => {
    const stub = gripStubs.get("testMaxProps");

    const renderObjectInspector = mode => mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: actor => {
        return {
          ownProperties: Object.keys(stub.preview.ownProperties).reduce((res, key) => {
            return Object.assign({
              [key]: {
                value: stub
              },
            }, res);
          }, {}),
        };
      },
      loadObjectProperties: () => {},
      mode,
    }));
    const renderRep = mode => Rep({object: stub, mode});

    const tinyOi = renderObjectInspector(MODE.TINY);
    expect(tinyOi.find(".node").at(1).contains(renderRep(MODE.TINY))).toBeTruthy();

    const shortOi = renderObjectInspector(MODE.SHORT);
    expect(shortOi.find(".node").at(1).contains(renderRep(MODE.TINY))).toBeTruthy();

    const longOi = renderObjectInspector(MODE.LONG);
    expect(longOi.find(".node").at(1).contains(renderRep(MODE.SHORT))).toBeTruthy();

    const oi = renderObjectInspector();
    // When no mode is provided, it defaults to TINY mode to render the Rep.
    expect(oi.find(".node").at(1).contains(renderRep(MODE.TINY))).toBeTruthy();
  });

  it("does not load properties if getObjectProperties returns a truthy element", () => {
    const stub = gripStubs.get("testMaxProps");
    const loadObjectProperties = jest.fn();

    mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: actor => {
        return {
          ownProperties: stub.preview.ownProperties,
        };
      },
      loadObjectProperties,
    }));

    expect(loadObjectProperties.mock.calls.length).toBe(0);
  });

  it("calls loadObjectProperties when expandable leaf is clicked", () => {
    const stub = gripStubs.get("testMaxProps");
    const loadObjectProperties = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties,
    }));

    const node = oi.find(".node");
    node.simulate("click");

    expect(loadObjectProperties.mock.calls.length).toBe(1);
  });

  it("calls the onFocus prop function when provided one and given focus", () => {
    const stub = gripStubs.get("testMaxProps");
    const onFocus = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      onFocus,
    }));

    const node = oi.find(".node").first();
    node.simulate("focus");

    expect(onFocus.mock.calls.length).toBe(1);
  });

  it("calls the onDoubleClick prop function when provided one and double clicked", () => {
    const stub = gripStubs.get("testMaxProps");
    const onDoubleClick = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      onDoubleClick,
    }));

    const node = oi.find(".node").first();
    node.simulate("doubleclick");

    expect(onDoubleClick.mock.calls.length).toBe(1);
  });

  it("calls the onLabel prop function when provided one and label clicked", () => {
    const stub = gripStubs.get("testMaxProps");
    const onLabelClick = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectProperties: actor => {
        return {
          ownProperties: stub.preview.ownProperties,
        };
      },
      loadObjectProperties: () => {},
      onLabelClick,
    }));

    const label = oi.find(".object-label").first();
    label.simulate("click");

    expect(onLabelClick.mock.calls.length).toBe(1);
  });
});
