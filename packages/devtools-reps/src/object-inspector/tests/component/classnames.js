/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 0,
    roots: [{
      path: "root",
      name: "root",
      contents: {value: 42}
    }],
    getObjectProperties: () => {},
    loadObjectProperties: () => {},
  }, overrides);
}

describe("ObjectInspector - classnames", () => {
  it("has the expected class", () => {
    const props = generateDefaults();
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);

    expect(wrapper.hasClass("tree")).toBeTruthy();
    expect(wrapper.hasClass("inline")).toBeFalsy();
    expect(wrapper.hasClass("nowrap")).toBeFalsy();
    expect(oi).toMatchSnapshot();
  });

  it("has the nowrap class when disableWrap prop is true", () => {
    const props = generateDefaults({
      disableWrap: true,
    });
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    expect(wrapper.hasClass("nowrap")).toBeTruthy();
    expect(oi).toMatchSnapshot();
  });

  it("has the inline class when inline prop is true", () => {
    const props = generateDefaults({
      inline: true,
    });
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    expect(wrapper.hasClass("inline")).toBeTruthy();
    expect(oi).toMatchSnapshot();
  });
});
