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

describe("ObjectInspector - dimTopLevelWindow", () => {
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
});
