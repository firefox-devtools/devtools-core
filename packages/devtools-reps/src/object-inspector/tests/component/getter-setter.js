/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const { MODE } = require("../../../reps/constants");
const { formatObjectInspector } = require("../test-utils");

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

    expect(formatObjectInspector(oi)).toMatchSnapshot();
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

    expect(formatObjectInspector(oi)).toMatchSnapshot();
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

    expect(formatObjectInspector(oi)).toMatchSnapshot();
  });
});
