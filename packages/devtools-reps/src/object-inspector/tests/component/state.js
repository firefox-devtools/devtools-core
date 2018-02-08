/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const repsPath = "../../../reps";
const { MODE } = require(`${repsPath}/constants`);
const ObjectClient = require("../__mocks__/object-client");
const gripRepStubs = require(`${repsPath}/stubs/grip`);
const gripPropertiesStubs = require("../../stubs/grip");
const { formatObjectInspector } = require("../test-utils");

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 0,
    roots: [{
      path: "root-1",
      contents: {
        value: gripRepStubs.get("testMoreThanMaxProps")
      }
    }, {
      path: "root-2",
      contents: {
        value: gripRepStubs.get("testProxy")
      }
    }],
    createObjectClient: grip => ObjectClient(grip),
    mode: MODE.LONG,
  }, overrides);
}

describe("ObjectInspector - state", () => {
  it("has the expected expandedPaths state", async () => {
    const wrapper = mount(ObjectInspector(generateDefaults({
      loadedProperties: new Map([
        ["root-1", gripPropertiesStubs.get("proto-properties-symbols")]
      ])
    })));
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    let nodes = wrapper.find(".node");

    // Clicking on the root node adds it path to "expandedPaths".
    const root1 = nodes.at(0);
    const root2 = nodes.at(1);

    root1.simulate("click");
    expect(wrapper.state("expandedPaths").has("root-1")).toBeTruthy();
    expect(wrapper.state("expandedPaths").has("root-2")).toBeFalsy();
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    // Clicking on the root node removes it path from "expandedPaths".
    root1.simulate("click");
    expect(wrapper.state("expandedPaths").has("root-1")).toBeFalsy();
    expect(wrapper.state("expandedPaths").has("root-2")).toBeFalsy();
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    root2.simulate("click");
    expect(wrapper.state("expandedPaths").has("root-1")).toBeFalsy();
    expect(wrapper.state("expandedPaths").has("root-2")).toBeTruthy();
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    root1.simulate("click");
    expect(wrapper.state("expandedPaths").has("root-1")).toBeTruthy();
    expect(wrapper.state("expandedPaths").has("root-2")).toBeTruthy();
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    nodes = wrapper.find(".node");
    const propNode = nodes.at(1);
    const symbolNode = nodes.at(2);
    const protoNode = nodes.at(3);

    propNode.simulate("click");
    symbolNode.simulate("click");
    protoNode.simulate("click");

    expect(wrapper.state("expandedPaths").has("root-1")).toBeTruthy();
    expect(wrapper.state("expandedPaths").has("root-2")).toBeTruthy();
    expect(wrapper.state("expandedPaths").has("root-1/__proto__")).toBeTruthy();

    // The property and symbols have primitive values, and can't be expanded.
    expect(wrapper.state("expandedPaths").size).toBe(3);
  });

  it("has the expected state when expanding a node", async () => {
    const protoStub = {
      "prototype": {
        "type": "object",
        "actor": "server2.conn0.child1/obj628",
        "class": "Object",
      }
    };

    const wrapper = mount(ObjectInspector(generateDefaults({
      createObjectClient: grip => ObjectClient(grip, {
        getPrototype: () => Promise.resolve(protoStub)
      }),
    })));
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    let nodes = wrapper.find(".node");

    const root1 = nodes.at(0);

    // Clicking on the root node adds it path to "loading".
    root1.simulate("click");
    let state = wrapper.state();
    expect(state.loading.has("root-1")).toBeTruthy();

    // Once all the loading promises are resolved, the loading
    // state property should be cleaned up, and actors and loadedProperties
    // should have the expected values.
    await state.loading.get("root-1");

    state = wrapper.state();
    expect(state.loading.has("root-1")).toBeFalsy();
    expect(state.loadedProperties.has("root-1")).toBeTruthy();
    // We don't want to track root actors.
    expect(state.actors.has(gripRepStubs.get("testMoreThanMaxProps").actor))
      .toBeFalsy();
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    nodes = wrapper.find(".node");
    const protoNode = nodes.at(1);
    protoNode.simulate("click");

    state = wrapper.state();
    expect(state.loading.has("root-1/__proto__")).toBeTruthy();

    // Once all the loading promises are resolved, the loading
    // state property should be cleaned up, and actors and loadedProperties
    // should have the expected values.
    await state.loading.get("root-1/__proto__");
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    state = wrapper.state();

    expect(state.loading.has("root-1/__proto__")).toBeFalsy();
    expect(state.loadedProperties.has("root-1/__proto__")).toBeTruthy();
    expect(state.actors.has(protoStub.prototype.actor)).toBeTruthy();
  });

  it("has the expected state when expanding a proxy node", async () => {
    const protoStub = {
      "prototype": {
        "type": "object",
        "actor": "server2.conn0.child1/obj628",
        "class": "Object",
      }
    };

    const wrapper = mount(ObjectInspector(generateDefaults({
      createObjectClient: grip => ObjectClient(grip, {
        getPrototype: () => Promise.resolve(protoStub)
      }),
    })));
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    let nodes = wrapper.find(".node");

    const proxyNode = nodes.at(1);

    // Clicking on the proxy should load the prototype.
    proxyNode.simulate("click");

    let state = wrapper.state();
    expect(state.loading.has("root-2")).toBeTruthy();

    // Once all the loading promises are resolved, the loading
    // state property should be cleaned up, and actors and loadedProperties
    // should have the expected values.
    await state.loading.get("root-2");
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    state = wrapper.state();
    expect(state.loading.has("root-2")).toBeFalsy();
    expect(state.loadedProperties.get("root-2")).toEqual(protoStub);
    // We don't want to track root actors.
    expect(state.actors.has(gripRepStubs.get("testProxy").actor)).toBeFalsy();

    nodes = wrapper.find(".node");
    const protoNode = nodes.at(4);
    protoNode.simulate("click");

    state = wrapper.state();
    expect(state.loading.has("root-2/__proto__")).toBeTruthy();

    // Once all the loading promises are resolved, the loading
    // state property should be cleaned up, and actors and loadedProperties
    // should have the expected values.
    await state.loading.get("root-2/__proto__");
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    state = wrapper.state();

    expect(state.loading.has("root-2/__proto__")).toBeFalsy();
    expect(state.loadedProperties.has("root-2/__proto__")).toBeTruthy();
    expect(state.actors.has(protoStub.prototype.actor)).toBeTruthy();
  });

  it("does not expand if the user selected some text", async () => {
    const wrapper = mount(ObjectInspector(generateDefaults({
      loadedProperties: new Map([
        ["root-1", gripPropertiesStubs.get("proto-properties-symbols")]
      ])
    })));
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    let nodes = wrapper.find(".node");

    // Set a selection using the mock.
    getSelection().setMockSelection("test");

    const root1 = nodes.at(0);
    root1.simulate("click");
    expect(wrapper.state("expandedPaths").has("root-1")).toBeFalsy();
    expect(formatObjectInspector(wrapper)).toMatchSnapshot();

    // Clear the selection for other tests.
    getSelection().setMockSelection();
  });
});
