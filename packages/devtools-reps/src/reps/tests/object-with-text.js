/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  REPS,
  getRep,
} = require("../rep");

const { shallow } = require("enzyme");
const React = require("react");
const {
  expectActorAttribute,
} = require("./test-helpers");

const stubs = require("../stubs/object-with-text");
const { ObjectWithText, Rep } = REPS;

describe("Object with text", () => {
  const gripStub = stubs.get("ObjectWithText");

  // Test that correct rep is chosen
  it("selects ObjectsWithText Rep", () => {
    expect(getRep(gripStub)).toEqual(ObjectWithText.rep);
  });

  // Test rendering
  it("renders with the correct text content", () => {
    const renderedComponent = shallow(Rep({
      object: gripStub
    }));

    expect(renderedComponent.text()).toEqual("\".Shadow\"");
    expectActorAttribute(renderedComponent, gripStub.actor);
  });

  // Test rendering with objectLink
  it("renders with correct text content when an objectLink is passed as a prop", () => {
    const renderedComponent = shallow(Rep({
      object: gripStub,
      objectLink: (props, ...children) => React.DOM.span(
        {},
        "*",
        ...children, "*"
      )
    }));

    expect(renderedComponent.text()).toEqual("*CSSStyleRule *\".Shadow\"");
  });
});
