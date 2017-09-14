/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

  /* global jest */

const { mount } = require("enzyme");
const React = require("react");
const { createFactory } = React;
const ObjectInspector = createFactory(require("../../index"));
const repsPath = "../../../reps";
const gripRepStubs = require(`${repsPath}/stubs/grip`);
const ObjectClient = require("../__mocks__/object-client");
const stub = gripRepStubs.get("testMoreThanMaxProps");

function generateDefaults(overrides) {
  return Object.assign({
    autoExpandDepth: 0,
    roots: [{
      path: "root",
      contents: {
        value: stub
      }
    }],
    createObjectClient: grip => ObjectClient(grip)
  }, overrides);
}

describe("release actors", () => {
  it("release actors when unmount", () => {
    const releaseActor = jest.fn();
    const props = generateDefaults({
      releaseActor,
    });
    const oi = ObjectInspector(props);
    const wrapper = mount(oi);
    wrapper.setState({
      actors: new Set(["actor 1", "actor 2"])
    });
    wrapper.unmount();
    expect(releaseActor.mock.calls.length).toBe(2);
    expect(releaseActor.mock.calls[0][0]).toBe("actor 1");
    expect(releaseActor.mock.calls[1][0]).toBe("actor 2");
  });
});
