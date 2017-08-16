/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const { MODE } = require("../../../reps/constants");

const functionStubs = require("../../../reps/stubs/function");

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 1,
    getObjectProperties: () => {},
    loadObjectProperties: () => {},
  }, overrides);
}

describe("ObjectInspector - functions", () => {
  it("renders named function properties as expected", () => {
    const stub = functionStubs.get("Named");
    const oi = mount(ObjectInspector(generateDefaults({
      roots: [{
        path: "root",
        name: "x",
        contents: [{
          path: "root/fn",
          name: "fn",
          contents: {value: stub}
        }]
      }],
    })));

    const nodes = oi.find(".node");

    const functionNode = nodes.last();
    expect(functionNode.text()).toBe("testName()");
  });

  it("renders anon function properties as expected", () => {
    const stub = functionStubs.get("Anon");
    const oi = mount(ObjectInspector(generateDefaults({
      roots: [{
        path: "root",
        name: "x",
        contents: [{
          path: "root/fn",
          name: "fn",
          contents: {value: stub}
        }]
      }],
    })));

    const nodes = oi.find(".node");

    const functionNode = nodes.last();
    // It should have the name of the property.
    expect(functionNode.text()).toBe("fn()");
  });

  it("renders non-TINY mode functions as expected", () => {
    const stub = functionStubs.get("Named");
    const oi = mount(ObjectInspector(generateDefaults({
      roots: [{
        path: "root",
        name: "x",
        contents: {value: stub}
      }],
      mode: MODE.LONG,
    })));

    const nodes = oi.find(".node");

    const functionNode = nodes.first();
    // It should have the name of the property.
    expect(functionNode.text()).toBe("x : function testName()");
  });
});
