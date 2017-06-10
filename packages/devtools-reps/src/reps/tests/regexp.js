/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { shallow } = require("enzyme");
const {
  REPS,
  getRep,
} = require("../rep");
const { Rep, RegExp } = REPS;
const stubs = require("../stubs/regexp");

describe("test RegExp", () => {
  const stub = stubs.get("RegExp");

  it("selects RegExp Rep", () => {
    expect(getRep(stub)).toEqual(RegExp.rep);
  });

  it("renders with expected text content", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));

    expect(renderedComponent.text()).toEqual("/ab+c/i");
  });

  it("renders the expected text content when an objectLink is passed as a prop", () => {
    const renderedComponent = shallow(Rep({
      object: stub,
      objectLink: (props, ...children) => React.DOM.span({},
        "*", ...children, "*")
    }));

    expect(renderedComponent.text()).toEqual("*/ab+c/i*");
  });
});
