/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const {
  createNode,
} = require("../../utils");

const gripWindowStubs = require("../../../reps/stubs/window");

const windowNode = createNode(
  null,
  "window",
  "windowpath",
  {value: gripWindowStubs.get("Window")}
);

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 0,
    roots: [windowNode],
    getObjectProperties: () => {},
    loadObjectProperties: () => {},
  }, overrides);
}

describe("ObjectInspector - dimTopLevelWindow", () => {
  it("renders collapsed top-level window when dimTopLevelWindow is true", () => {
    // The window node should have the "lessen" class when collapsed.
    const props = generateDefaults({
      dimTopLevelWindow: true,
    });
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    expect(wrapper.find(".node.lessen").exists()).toBeTruthy();
    expect(oi).toMatchSnapshot();
  });

  it("renders expanded top-level window when dimTopLevelWindow is true", () => {
    // The window node should not have the "lessen" class when expanded.
    const props = generateDefaults({
      dimTopLevelWindow: true,
      autoExpandDepth: 1,
    });
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    expect(wrapper.find(".node.lessen").exists()).toBeFalsy();
    expect(oi).toMatchSnapshot();
  });

  it("renders collapsed top-level window when dimTopLevelWindow is false", () => {
    // The window node should not have the "lessen" class when dimTopLevelWindow is falsy.
    const props = generateDefaults();
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    expect(wrapper.find(".node.lessen").exists()).toBeFalsy();
    expect(oi).toMatchSnapshot();
  });

  it("renders sub-level window", () => {
    // The window node should not have the "lessen" class when it is not at top level.
    const root = createNode(
      null,
      "root",
      "rootpath",
      [windowNode]
    );

    const props = generateDefaults({
      autoExpandDepth: 1,
      roots: [root],
      dimTopLevelWindow: true,
    });
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    const nodes = wrapper.find(".node");
    const win = nodes.at(1);

    // Make sure we target the window object.
    expect(win.find(".objectBox-Window").exists()).toBeTruthy();
    expect(win.hasClass("lessen")).toBeFalsy();
    expect(oi).toMatchSnapshot();
  });
});
