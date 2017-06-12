/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { shallow } = require("enzyme");
const React = require("react");

const {
  REPS,
  getRep,
} = require("../rep");

let { Attribute, Rep } = REPS;

const stubs = require("../stubs/attribute");

describe("Attribute", () => {
  const stub = stubs.get("Attribute");

  it("Rep correctly selects Attribute Rep", () => {
    expect(getRep(stub)).toBe(Attribute.rep);
  });

  it("Attribute rep has expected text content", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));
    expect(renderedComponent.text()).toEqual("class=\"autocomplete-suggestions\"");
  });

  it("Attribute rep has expected text when an objectLink is passed as a prop", () => {
    const renderedComponent = shallow(Rep({
      object: stub,
      objectLink: (props, ...children) => React.DOM.span({}, "*", ...children, "*")
    }));
    expect(renderedComponent.text()).toEqual("*class=\"autocomplete-suggestions\"*");
  });
});
