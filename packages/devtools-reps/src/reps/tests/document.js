/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { shallow } = require("enzyme");
const {
  REPS,
  getRep,
} = require("../rep");
const { Document } = REPS;
const stubs = require("../stubs/document");
const stub = stubs.get("Document");

describe("test Document", () => {
  it("correctly selects Document Rep", () => {
    expect(getRep(stub)).toBe(Document.rep);
  });

  it("renders with expected text content", () => {
    const renderedComponent = shallow(Document.rep({
      object: stub
    }));

    expect(renderedComponent.text())
      .toEqual("HTMLDocument https://www.mozilla.org/en-US/firefox/new/");
  });
});

describe("test Document with ObjectLink", () => {
  it("renders with expected text content", () => {
    const renderedComponent = shallow(Document.rep({
      object: stub,
      objectLink: (props, ...children) => React.DOM.span({},
        "*", ...children, "*")
    }));

    expect(renderedComponent.text())
      .toEqual("*HTMLDocument *https://www.mozilla.org/en-US/firefox/new/");
  });
});
