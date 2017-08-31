/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const { MODE } = require("../../../reps/constants");
const stub = require("../../../reps/stubs/grip").get("testProxy");

const ObjectClient = require("../__mocks__/object-client");
function generateDefaults(overrides) {
  return Object.assign({
    roots: [{
      path: "root",
      contents: {value: stub}
    }],
    autoExpandDepth: 1,
    mode: MODE.LONG,
    createObjectClient: grip => ObjectClient(grip),
    // Have the prototype already loaded so the component does not call
    // enumProperties for the root's properties.
    loadedProperties: new Map([
      ["root", {prototype: {}}]
    ])
  }, overrides);
}

describe("ObjectInspector - Proxy", () => {
  it("renders Proxy as expected", () => {
    const enumProperties = jest.fn();

    const props = generateDefaults({
      createObjectClient: grip => ObjectClient(grip, {enumProperties}),
    });
    const oi = mount(ObjectInspector(props));
    expect(oi.debug()).toMatchSnapshot();

    const nodes = oi.find(".node");
    /*
     * The OI should look like:
     * ▶︎ Proxy
     *   ▶︎ <target> : Object { … }
     *   ▶︎ <handler> : Array [ … ]
     *   ▶︎ __proto__ : Object {…}
     */
    expect(nodes.length).toBe(4);

    // The root should be expandable.
    const rootNode = nodes.first();
    expect(rootNode.find(".arrow").exists()).toBeTruthy();
    expect(rootNode.text()).toMatch(/^Proxy/);

    const targetNode = nodes.at(1);
    expect(targetNode.find(".arrow").exists()).toBeTruthy();
    expect(targetNode.text()).toBe("<target> : Object { … }");

    const handlerNode = nodes.at(2);
    expect(handlerNode.find(".arrow").exists()).toBeTruthy();
    expect(handlerNode.text()).toBe("<handler> : Array [ … ]");

    const protoNode = nodes.at(3);
    expect(protoNode.text()).toBe("__proto__ : Object {  }");

    // enumProperties should not have been called.
    expect(enumProperties.mock.calls.length).toBe(0);
  });

  it("calls enumProperties when <target> and <handler> nodes are clicked", () => {
    const enumProperties = jest.fn();

    const props = generateDefaults({
      createObjectClient: grip => ObjectClient(grip, {enumProperties}),
    });
    const oi = mount(ObjectInspector(props));

    const nodes = oi.find(".node");

    const targetNode = nodes.at(1);
    const handlerNode = nodes.at(2);

    targetNode.simulate("click");
    // The function is called twice,  to get  both non-indexed and indexed properties.
    expect(enumProperties.mock.calls.length).toBe(2);
    expect(enumProperties.mock.calls[0][0]).toEqual({ignoreNonIndexedProperties: true});
    expect(enumProperties.mock.calls[1][0]).toEqual({ignoreIndexedProperties: true});

    handlerNode.simulate("click");
    // The function is called twice,  to get  both non-indexed and indexed properties.
    expect(enumProperties.mock.calls.length).toBe(4);
    expect(enumProperties.mock.calls[2][0]).toEqual({ignoreNonIndexedProperties: true});
    expect(enumProperties.mock.calls[3][0]).toEqual({ignoreIndexedProperties: true});
  });
});
