/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const { MODE } = require("../../../reps/constants");

const accessorStubs = require("../../../reps/stubs/accessor");
const ObjectClient = require("../__mocks__/object-client");

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 1,
    createObjectClient: grip => ObjectClient(grip),
    mode: MODE.LONG,
  }, overrides);
}

describe("ObjectInspector - getters & setters", () => {
  it("renders getters as expected", () => {
    const stub = accessorStubs.get("getter");
    const oi = mount(ObjectInspector(generateDefaults({
      roots: [{
        path: "root",
        name: "x",
        contents: stub
      }],
    })));

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
    const oi = mount(ObjectInspector(generateDefaults({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        name: "x",
        contents: stub
      }],
    })));

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
    const oi = mount(ObjectInspector(generateDefaults({
      roots: [{
        path: "root",
        name: "x",
        contents: stub
      }],
    })));

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
});
