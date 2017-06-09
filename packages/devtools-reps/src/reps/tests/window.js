/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { shallow } = require("enzyme");

const {
  REPS,
  getRep,
} = require("../rep");

const { MODE } = require("../constants");
const { Rep, Window } = REPS;
const stubs = require("../stubs/window");

describe("test Window", () => {
  const stub = stubs.get("Window");

  it("selects Window Rep correctly", () => {
    expect(getRep(stub)).toBe(Window.rep);
  });

  it("renders with correct class name", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));

    expect(renderedComponent.hasClass("objectBox-Window")).toBe(true);
  });

  it("renders with correct content", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));

    expect(renderedComponent.text()).toEqual("Window about:newtab");
  });

  it("renders with correct inner HTML structure and content", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));

    expect(renderedComponent.find(".objectPropValue").text()).toEqual("about:newtab");
  });

  it("renders with expected text in TINY mode", () => {
    const renderedComponent = shallow(Rep({
      object: stub,
      mode: MODE.TINY,
    }));

    expect(renderedComponent.text()).toEqual("Window");
  });

  it("renders with expected text in LONG mode", () => {
    const renderedComponent = shallow(Rep({
      object: stub,
      mode: MODE.LONG,
    }));

    expect(renderedComponent.text()).toEqual("Window about:newtab");
  });

  it("renders with expected text in TINY mode with Custom display class", () => {
    const renderedComponent = shallow(Rep({
      object: Object.assign({}, stub, { displayClass: "Custom" }),
      mode: MODE.TINY
    }));

    expect(renderedComponent.text()).toEqual("Custom");
  });

  it("renders with expected text in LONG mode with Custom display class", () => {
    const renderedComponent = shallow(Rep({
      object: Object.assign({}, stub, { displayClass: "Custom" }),
      mode: MODE.LONG,
      title: "Custom"
    }));

    expect(renderedComponent.text()).toEqual("Custom about:newtab");
  });

  it("renders expected text in TINY mode when an objectLink is passed as a prop", () => {
    const renderedComponent = shallow(Rep({
      object: stub,
      mode: MODE.TINY,
      objectLink: (props, ...children) => React.DOM.span({},
        "*", ...children, "*")
    }));

    expect(renderedComponent.text()).toEqual("*Window*");
  });

  it("renders expected text in LONG mode when an objectLink is passed as a prop", () => {
    const renderedComponent = shallow(Rep({
      object: stub,
      mode: MODE.LONG,
      objectLink: (props, ...children) => React.DOM.span({},
        "*", ...children, "*")
    }));

    expect(renderedComponent.text()).toEqual("*Window* about:newtab");
  });
});
