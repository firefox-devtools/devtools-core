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
