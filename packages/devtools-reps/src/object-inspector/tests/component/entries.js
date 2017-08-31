/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const { MODE } = require("../../../reps/constants");

const gripMapRepStubs = require("../../../reps/stubs/grip-map");
const mapStubs = require("../../stubs/map");
const ObjectClient = require("../__mocks__/object-client");
const { SAFE_PATH_PREFIX } = require("../../utils/node");

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 0,
    createObjectClient: grip => ObjectClient(grip)
  }, overrides);
}

describe("ObjectInspector - entries", () => {
  it("renders Object with entries as expected", async () => {
    const stub = gripMapRepStubs.get("testSymbolKeyedMap");
    const enumEntries = jest.fn();

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
        ["root/__proto__", true]
      ])
    })));

    const nodes = oi.find(".node");
    /*
     * The OI should look like:
     * ▶︎ Map
     *     size : 2
     *   ▶︎ <entries>
     *     ▶︎ 0: Symbol(a) → "value-a"
     *       ▶︎ <key>: Symbol(a)
     *       ▶︎ <value>: "value-a"
     *     ▶︎ 1: Symbol(b) → "value-b"
     *       ▶︎ <key>: Symbol(b)
     *       ▶︎ <value>: "value-b"
     *   ▶︎ __proto__
     */
    expect(nodes.length).toBe(10);

    // The root should be expandable.
    const rootNode = nodes.first();
    expect(rootNode.find(".arrow").exists()).toBeTruthy();
    expect(rootNode.text()).toMatch(/^Map {/);

    const sizeNode = nodes.at(1);
    expect(sizeNode.find(".arrow").exists()).toBeFalsy();
    expect(sizeNode.text()).toBe("size : 2");

    const entriesNode = nodes.at(2);
    expect(entriesNode.find(".arrow").exists()).toBeTruthy();
    expect(entriesNode.text()).toBe("<entries>");

    const firstEntryNode = nodes.at(3);
    expect(firstEntryNode.find(".arrow").exists()).toBeTruthy();
    expect(firstEntryNode.text()).toBe(`0 : Symbol(a) → "value-a"`);

    const firstEntryNodeKey = nodes.at(4);
    expect(firstEntryNodeKey.find(".arrow").exists()).toBeFalsy();
    expect(firstEntryNodeKey.text()).toBe("<key> : Symbol(a)");

    const firstEntryNodeValue = nodes.at(5);
    expect(firstEntryNodeValue.find(".arrow").exists()).toBeFalsy();
    expect(firstEntryNodeValue.text()).toBe('<value> : "value-a"');

    const secondEntryNode = nodes.at(6);
    expect(secondEntryNode.find(".arrow").exists()).toBeTruthy();
    expect(secondEntryNode.text()).toBe(`1 : Symbol(b) → "value-b"`);

    const secondEntryNodeKey = nodes.at(7);
    expect(secondEntryNodeKey.find(".arrow").exists()).toBeFalsy();
    expect(secondEntryNodeKey.text()).toBe("<key> : Symbol(b)");

    const secondEntryNodeValue = nodes.at(8);
    expect(secondEntryNodeValue.find(".arrow").exists()).toBeFalsy();
    expect(secondEntryNodeValue.text()).toBe('<value> : "value-b"');

    const protoNode = nodes.at(9);
    expect(protoNode.find(".arrow").exists()).toBeTruthy();
    expect(protoNode.text()).toMatch(/^__proto__/);

    // enumEntries shouldn't have been called since everything
    // is already in the preview property.
    expect(enumEntries.mock.calls.length).toBe(0);
  });

  it("does not call enumEntries if entries are already loaded", () => {
    const stub = gripMapRepStubs.get("testMoreThanMaxEntries");
    const enumEntries = jest.fn();

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
        ["root/__proto__", true]
      ])
    })));

    const nodes = wrapper.find(".node");
    /*
     * The OI should look like:
     * ▶︎ Map
     *     size : 11
     *   ▶︎ <entries>
     *     ▶︎ 0: "key-0" → "value-0"
     *       ▶︎ <key>: "key-0"
     *       ▶︎ <value>: "value-0"
     *     ▶︎ 1: "key-1" → "value-1"
     *       ▶︎ <key>: "key-1"
     *       ▶︎ <value>: "value-1"
     *     ▶︎ 2: "key-2" → "value-2"
     *       ▶︎ <key>: "key-2"
     *       ▶︎ <value>: "value-2"
     *     […]
     *     ▶︎ 10: "key-10" → "value-10"
     *       ▶︎ <key>: "key-10"
     *       ▶︎ <value>: "value-10"
     *   ▶︎ __proto__
     */
    expect(nodes.length).toBe(
      4 // Map, size, entries and proto
      + (11 * 3) // 11 entries * 3 nodes (mapEntry, key node, value node)
    );

    // enumEntries was not called.
    expect(enumEntries.mock.calls.length).toBe(0);
  });

  it("calls ObjectClient.enumEntries when an <entries> node is clicked", () => {
    const stub = gripMapRepStubs.get("testMoreThanMaxEntries");
    const enumEntries = jest.fn();

    const oi = mount(ObjectInspector(generateDefaults({
      autoExpandDepth: 2,
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

    const node = oi.find(".node");
    const entriesNode = node.at(1);
    expect(entriesNode.text()).toBe("<entries>");
    entriesNode.simulate("click");

    expect(enumEntries.mock.calls.length).toBe(1);
  });
});
