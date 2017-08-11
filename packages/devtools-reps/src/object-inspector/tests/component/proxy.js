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

function generateDefaults(overrides) {
  return Object.assign({
    roots: [{
      path: "root",
      contents: {value: stub}
    }],
    autoExpandDepth: 1,
    mode: MODE.LONG,
    getObjectProperties: actor => null,
  }, overrides);
}

describe("ObjectInspector - Proxy", () => {
  it("renders Proxy as expected", () => {
    const loadObjectProperties = jest.fn();

    const props = generateDefaults({
      loadObjectProperties,
    });
    const oi = mount(ObjectInspector(props));
    expect(oi.debug()).toMatchSnapshot();

    const nodes = oi.find(".node");
    /*
     * The OI should look like:
     * ▶︎ Proxy
     *   ▶︎ <target> : Object { … }
     *   ▶︎ <handler> : Array [ … ]
     */
    expect(nodes.length).toBe(3);

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

    // loadObjectProperties should not have been called.
    expect(loadObjectProperties.mock.calls.length).toBe(0);
  });

  it("calls loadObjectProperties when <target> and <handler> nodes are clicked", () => {
    const loadObjectProperties = jest.fn();

    const props = generateDefaults({
      loadObjectProperties,
    });
    const oi = mount(ObjectInspector(props));
    const nodes = oi.find(".node");

    const targetNode = nodes.at(1);
    targetNode.simulate("click");
    expect(loadObjectProperties.mock.calls.length).toBe(1);
    expect(loadObjectProperties).toHaveBeenCalledWith(stub.proxyTarget);

    const handlerNode = nodes.at(2);
    handlerNode.simulate("click");

    expect(loadObjectProperties.mock.calls.length).toBe(2);
    expect(loadObjectProperties).toHaveBeenCalledWith(stub.proxyHandler);
  });
});
