/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const { MODE } = require("../../../reps/constants");
const { formatObjectInspector } = require("../test-utils");
const gripMapRepStubs = require("../../../reps/stubs/grip-map");
const mapStubs = require("../../stubs/map");
const ObjectClient = require("../__mocks__/object-client");
const { SAFE_PATH_PREFIX } = require("../../utils/node");

function generateDefaults(overrides) {
  return {
    autoExpandDepth: 0,
    createObjectClient: grip => ObjectClient(grip),
    ...overrides
  };
}

function getEnumEntriesMock() {
  return jest.fn(() => ({
    iterator: {
      slice: () => ({})
    }
  }));
}

describe("ObjectInspector - entries", () => {
  it("renders Object with entries as expected", async () => {
    const stub = gripMapRepStubs.get("testSymbolKeyedMap");
    const enumEntries = getEnumEntriesMock();

    let oi = mount(ObjectInspector(generateDefaults({
      autoExpandDepth: 3,
      roots: [{
        path: "root",
        contents: {value: stub}
      }],
      mode: MODE.LONG,
      createObjectClient: (grip) => {
        return ObjectClient(grip, {
          enumEntries,
        });
      },
      loadedProperties: new Map([
        ["root", mapStubs.get("properties")],
        ["root/<prototype>", true]
      ])
    })));

    expect(formatObjectInspector(oi)).toMatchSnapshot();

    // enumEntries shouldn't have been called since everything
    // is already in the preview property.
    expect(enumEntries.mock.calls.length).toBe(0);
  });

  it("does not call enumEntries if entries are already loaded", () => {
    const stub = gripMapRepStubs.get("testMoreThanMaxEntries");
    const enumEntries = getEnumEntriesMock();

    const wrapper = mount(ObjectInspector(generateDefaults({
      autoExpandDepth: 3,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      createObjectClient: (grip) => ObjectClient(grip, {enumEntries}),
      loadedProperties: new Map([
        ["root", mapStubs.get("properties")],
        [`root/${SAFE_PATH_PREFIX}entries`, mapStubs.get("11-entries")],
        ["root/<prototype>", true]
      ])
    })));

    expect(formatObjectInspector(wrapper)).toMatchSnapshot();
    // enumEntries was not called.
    expect(enumEntries.mock.calls.length).toBe(0);
  });

  it("calls ObjectClient.enumEntries when an <entries> node is clicked", () => {
    const stub = gripMapRepStubs.get("testMoreThanMaxEntries");
    const enumEntries = getEnumEntriesMock();

    const oi = mount(ObjectInspector(generateDefaults({
      autoExpandDepth: 1,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      createObjectClient: (grip) => ObjectClient(grip, {enumEntries}),
      loadedProperties: new Map([
        ["root", {ownProperties: stub.preview.entries}],
      ]),
    })));

    expect(formatObjectInspector(oi)).toMatchSnapshot();

    const nodes = oi.find(".node");
    const entriesNode = nodes.at(1);
    expect(entriesNode.text()).toBe("<entries>");

    entriesNode.simulate("click");
    expect(formatObjectInspector(oi)).toMatchSnapshot();
    expect(enumEntries.mock.calls.length).toBe(1);
  });
});
