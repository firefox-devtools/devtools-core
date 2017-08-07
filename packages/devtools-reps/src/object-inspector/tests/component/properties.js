/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));

const gripRepStubs = require("../../../reps/stubs/grip");

describe("ObjectInspector - properties", () => {
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
});
