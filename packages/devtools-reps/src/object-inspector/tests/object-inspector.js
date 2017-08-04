/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../index"));
const {
  createNode,
  NODE_TYPES,
} = require("../utils");
const { MODE } = require("../../reps/constants");
const { Rep } = require("../../reps/rep");

const gripRepStubs = require("../../reps/stubs/grip");
const gripMapRepStubs = require("../../reps/stubs/grip-map");
const gripWindowStubs = require("../../reps/stubs/window");
const mapStubs = require("../stubs/map");
const accessorStubs = require("../../reps/stubs/accessor");

describe("ObjectInspector", () => {
  it("renders as expected", () => {
    const stub = gripRepStubs.get("testMoreThanMaxProps");

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
    const object = gripRepStubs.get("testMoreThanMaxProps");
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
    const object = gripRepStubs.get("testMoreThanMaxProps");

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
    const stub = gripRepStubs.get("testMaxProps");

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

  it("renders getters as expected", () => {
    const stub = accessorStubs.get("getter");
    const oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        name: "x",
        contents: stub
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode: MODE.LONG,
    }));

    const nodes = oi.find(".node");
    // There should be the root and a leaf.
    expect(nodes.length).toBe(2);

    // The root should be expandable.
    const rootLeaf = nodes.first();
    expect(rootLeaf.find(".arrow").exists()).toBeTruthy();
    expect(rootLeaf.text()).toBe("x : Getter");

    const getLeaf = nodes.last();
    expect(getLeaf.find(".arrow").exists()).toBeTruthy();
    expect(getLeaf.text()).toBe("<get> : function get x()");
  });

  it("renders setters as expected", () => {
    const stub = accessorStubs.get("setter");
    const oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        name: "x",
        contents: stub
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode: MODE.LONG,
    }));

    const nodes = oi.find(".node");
    // There should be the root and a leaf.
    expect(nodes.length).toBe(2);

    // The root should be expandable.
    const rootLeaf = nodes.first();
    expect(rootLeaf.find(".arrow").exists()).toBeTruthy();
    expect(rootLeaf.text()).toBe("x : Setter");

    const getLeaf = nodes.last();
    expect(getLeaf.find(".arrow").exists()).toBeTruthy();
    expect(getLeaf.text()).toBe("<set> : function set x()");
  });

  it("renders getters and setters as expected", () => {
    const stub = accessorStubs.get("getter setter");
    const oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        name: "x",
        contents: stub
      }],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
      mode: MODE.LONG,
    }));

    const nodes = oi.find(".node");
    // There should be the root and 2 leaves.
    expect(nodes.length).toBe(3);

    // The root should be expandable.
    const rootLeaf = nodes.first();
    expect(rootLeaf.find(".arrow").exists()).toBeTruthy();
    expect(rootLeaf.text()).toBe("x : Getter & Setter");

    const getLeaf = nodes.at(1);
    expect(getLeaf.find(".arrow").exists()).toBeTruthy();
    expect(getLeaf.text()).toBe("<get> : function get x()");

    const setLeaf = nodes.at(2);
    expect(setLeaf.find(".arrow").exists()).toBeTruthy();
    expect(setLeaf.text()).toBe("<set> : function set x()");
  });

  it("renders Object with entries as expected", () => {
    const stub = gripMapRepStubs.get("testSymbolKeyedMap");
    const loadObjectEntries = jest.fn();
    const loadObjectProperties = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: Infinity,
      roots: [{
        path: "root",
        contents: {value: stub}
      }],
      getObjectEntries: () => {},
      getObjectProperties: actor => {
        if (actor === stub.actor) {
          return mapStubs.get("properties");
        }
        return null;
      },
      loadObjectEntries,
      loadObjectProperties,
      mode: MODE.LONG,
    }));

    const nodes = oi.find(".node");
    /*
     * The OI should look like:
     * ▶︎ Map
     *     size : 2
     *   ▶︎ <entries>
     *     ▶︎ 0: Symbol(a) → "value-a"
     *       ▶︎ <key>: Symbol(a)
     *       ▶︎ <value>: "value-a"
     *     ▶︎ 1: Symbol(b) → "value-b"
     *       ▶︎ <key>: Symbol(b)
     *       ▶︎ <value>: "value-b"
     *   ▶︎ __proto__
     */
    expect(nodes.length).toBe(10);

    // The root should be expandable.
    const rootNode = nodes.first();
    expect(rootNode.find(".arrow").exists()).toBeTruthy();
    expect(rootNode.text()).toMatch(/^Map {/);

    const sizeNode = nodes.at(1);
    expect(sizeNode.find(".arrow").exists()).toBeFalsy();
    expect(sizeNode.text()).toBe("size : 2");

    const entriesNode = nodes.at(2);
    expect(entriesNode.find(".arrow").exists()).toBeTruthy();
    expect(entriesNode.text()).toBe("<entries>");

    const firstEntryNode = nodes.at(3);
    expect(firstEntryNode.find(".arrow").exists()).toBeTruthy();
    expect(firstEntryNode.text()).toBe(`0 : Symbol(a) → "value-a"`);

    const firstEntryNodeKey = nodes.at(4);
    expect(firstEntryNodeKey.find(".arrow").exists()).toBeFalsy();
    expect(firstEntryNodeKey.text()).toBe("<key> : Symbol(a)");

    const firstEntryNodeValue = nodes.at(5);
    expect(firstEntryNodeValue.find(".arrow").exists()).toBeFalsy();
    expect(firstEntryNodeValue.text()).toBe('<value> : "value-a"');

    const secondEntryNode = nodes.at(6);
    expect(secondEntryNode.find(".arrow").exists()).toBeTruthy();
    expect(secondEntryNode.text()).toBe(`1 : Symbol(b) → "value-b"`);

    const secondEntryNodeKey = nodes.at(7);
    expect(secondEntryNodeKey.find(".arrow").exists()).toBeFalsy();
    expect(secondEntryNodeKey.text()).toBe("<key> : Symbol(b)");

    const secondEntryNodeValue = nodes.at(8);
    expect(secondEntryNodeValue.find(".arrow").exists()).toBeFalsy();
    expect(secondEntryNodeValue.text()).toBe('<value> : "value-b"');

    const protoNode = nodes.at(9);
    expect(protoNode.find(".arrow").exists()).toBeTruthy();
    expect(protoNode.text()).toMatch(/^__proto__/);

    // loadEntries shouldn't have been called since everything
    // is already in the preview property.
    expect(loadObjectEntries.mock.calls.length).toBe(0);
  });

  it("renders less-important nodes as expected", () => {
    const defaultPropertiesNode = createNode(
      null,
      "root",
      "rootpath",
      [],
      NODE_TYPES.DEFAULT_PROPERTIES
    );

    // The [default properties] node should have the "lessen" class only when collapsed.
    let oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [defaultPropertiesNode],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));

    let defaultPropertiesElementNode = oi.find(".node");
    expect(defaultPropertiesElementNode.hasClass("lessen")).toBe(true);

    oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [defaultPropertiesNode],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));

    defaultPropertiesElementNode = oi.find(".node");
    expect(defaultPropertiesElementNode.hasClass("lessen")).toBe(false);

    const prototypeNode = createNode(
      null,
      "root",
      "rootpath",
      [],
      NODE_TYPES.PROTOTYPE
    );

    // The __proto__ node should have the "lessen" class only when collapsed.
    oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [prototypeNode],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));

    let protoElementNode = oi.find(".node");
    expect(protoElementNode.hasClass("lessen")).toBe(true);

    oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [prototypeNode],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));

    protoElementNode = oi.find(".node");
    expect(protoElementNode.hasClass("lessen")).toBe(false);
  });

  it("renders collapsed top-level window when dimTopLevelWindow is true", () => {
    const windowNode = createNode(
      null,
      "window",
      "windowpath",
      {value: gripWindowStubs.get("Window")}
    );

    // The window node should have the "lessen" class when collapsed.
    let oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [windowNode],
      dimTopLevelWindow: true,
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));
    expect(oi.find(".node.lessen").exists()).toBeTruthy();
  });

  it("renders expanded top-level window when dimTopLevelWindow is true", () => {
    const windowNode = createNode(
      null,
      "window",
      "windowpath",
      {value: gripWindowStubs.get("Window")}
    );

    // The window node should not have the "lessen" class when expanded.
    const oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [windowNode],
      dimTopLevelWindow: true,
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));
    expect(oi.find(".node.lessen").exists()).toBeFalsy();
  });

  it("renders collapsed top-level window when dimTopLevelWindow is false", () => {
    const windowNode = createNode(
      null,
      "window",
      "windowpath",
      {value: gripWindowStubs.get("Window")}
    );

    // The window node should not have the "lessen" class when dimTopLevelWindow is falsy.
    const oi = mount(ObjectInspector({
      autoExpandDepth: 0,
      roots: [windowNode],
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));
    expect(oi.find(".node.lessen").exists()).toBeFalsy();
  });

  it("renders collapsed top-level window when dimTopLevelWindow is false", () => {
    const windowNode = createNode(
      null,
      "window",
      "windowpath",
      {value: gripWindowStubs.get("Window")}
    );

    // The window node should not have the "lessen" class when it is not at top level.
    const root = createNode(
      null,
      "root",
      "rootpath",
      [windowNode]
    );

    const oi = mount(ObjectInspector({
      autoExpandDepth: 1,
      roots: [root],
      dimTopLevelWindow: true,
      getObjectProperties: () => {},
      loadObjectProperties: () => {},
    }));
    const nodes = oi.find(".node");
    const win = nodes.at(1);

    // Make sure we target the window object.
    expect(win.find(".objectBox-Window").exists()).toBeTruthy();
    expect(win.hasClass("lessen")).toBeFalsy();
  });

  it("does not load properties if getObjectProperties returns a truthy element", () => {
    const stub = gripRepStubs.get("testMaxProps");
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

  it("does not load entries if getObjectEntries returns a truthy element", () => {
    const stub = gripMapRepStubs.get("testSymbolKeyedMap");
    const loadObjectEntries = jest.fn();
    const loadObjectProperties = jest.fn();

    mount(ObjectInspector({
      autoExpandDepth: 2,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectEntries: () => {},
      getObjectProperties: actor => {
        return {
          ownProperties: stub.preview.entries,
        };
      },
      loadObjectEntries,
      loadObjectProperties,
    }));

    expect(loadObjectEntries.mock.calls.length).toBe(0);
    expect(loadObjectProperties.mock.calls.length).toBe(0);
  });

  it("calls loadObjectProperties when expandable leaf is clicked", () => {
    const stub = gripRepStubs.get("testMaxProps");
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

  it("calls loadObjectEntries when an <entries> node is clicked", () => {
    const stub = gripMapRepStubs.get("testMoreThanMaxEntries");
    const loadObjectEntries = jest.fn();
    const loadObjectProperties = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: 2,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectEntries: () => {},
      getObjectProperties: actor => {
        return {
          ownProperties: stub.preview.entries,
        };
      },
      loadObjectEntries,
      loadObjectProperties,
    }));

    const node = oi.find(".node");
    const entriesNode = node.at(1);
    expect(entriesNode.text()).toBe("<entries>");
    entriesNode.simulate("click");

    expect(loadObjectEntries.mock.calls.length).toBe(1);
  });

  it("calls the onFocus prop function when provided one and given focus", () => {
    const stub = gripRepStubs.get("testMaxProps");
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
    const stub = gripRepStubs.get("testMaxProps");
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
    const stub = gripRepStubs.get("testMaxProps");
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
