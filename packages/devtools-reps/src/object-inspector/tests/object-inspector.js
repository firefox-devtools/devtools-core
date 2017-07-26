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
const accessorStubs = require("../../reps/stubs/accessor");

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
