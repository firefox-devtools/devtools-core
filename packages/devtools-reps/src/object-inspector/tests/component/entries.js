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

describe("ObjectInspector - entries", () => {
  it("renders Object with entries as expected", () => {
    const stub = gripMapRepStubs.get("testSymbolKeyedMap");
    const loadObjectEntries = jest.fn();
    const loadObjectProperties = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: Infinity,
      roots: [{
        path: "root",
        contents: {value: stub}
      }],
      getObjectEntries: () => {},
      getObjectProperties: actor => {
        if (actor === stub.actor) {
          return mapStubs.get("properties");
        }
        return null;
      },
      loadObjectEntries,
      loadObjectProperties,
      mode: MODE.LONG,
    }));

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

    // loadEntries shouldn't have been called since everything
    // is already in the preview property.
    expect(loadObjectEntries.mock.calls.length).toBe(0);
  });

  it("does not load entries if getObjectEntries returns a truthy element", () => {
    const stub = gripMapRepStubs.get("testSymbolKeyedMap");
    const loadObjectEntries = jest.fn();
    const loadObjectProperties = jest.fn();

    mount(ObjectInspector({
      autoExpandDepth: 2,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectEntries: () => {},
      getObjectProperties: actor => {
        return {
          ownProperties: stub.preview.entries,
        };
      },
      loadObjectEntries,
      loadObjectProperties,
    }));

    expect(loadObjectEntries.mock.calls.length).toBe(0);
    expect(loadObjectProperties.mock.calls.length).toBe(0);
  });

  it("calls loadObjectEntries when an <entries> node is clicked", () => {
    const stub = gripMapRepStubs.get("testMoreThanMaxEntries");
    const loadObjectEntries = jest.fn();
    const loadObjectProperties = jest.fn();

    const oi = mount(ObjectInspector({
      autoExpandDepth: 2,
      roots: [{
        path: "root",
        contents: {
          value: stub
        }
      }],
      getObjectEntries: () => {},
      getObjectProperties: actor => {
        return {
          ownProperties: stub.preview.entries,
        };
      },
      loadObjectEntries,
      loadObjectProperties,
    }));

    const node = oi.find(".node");
    const entriesNode = node.at(1);
    expect(entriesNode.text()).toBe("<entries>");
    entriesNode.simulate("click");

    expect(loadObjectEntries.mock.calls.length).toBe(1);
  });
});
