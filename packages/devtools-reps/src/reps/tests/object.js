/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { shallow } = require("enzyme");
const {
  REPS,
  getRep,
} = require("../rep");
const { Obj } = REPS;
const { MODE } = require("../constants");

const renderComponent = (object, props) => {
  return shallow(Obj.rep(Object.assign({ object }, props)));
};

describe("Object - Basic", () => {
  const object = {};
  const defaultOutput = "Object";

  it("selects the correct rep", () => {
    expect(getRep(object)).toBe(Obj.rep);
  });

  it("renders basic object as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - Max props", () => {
  const object = {a: "a", b: "b", c: "c"};
  const defaultOutput = "Object { a: \"a\", b: \"b\", c: \"c\" }";

  it("renders object with max props as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual("Object");
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - Many props", () => {
  const object = {};
  for (let i = 0; i < 100; i++) {
    object[`p${i}`] = i;
  }
  const defaultOutput = "Object { p0: 0, p1: 1, p2: 2, more… }";

  it("renders object with many props as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual("Object");
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - Uninteresting props", () => {
  const object = {a: undefined, b: undefined, c: "c", d: 0};
  const defaultOutput = "Object { c: \"c\", d: 0, a: undefined, more… }";

  it("renders object with uninteresting props as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual("Object");
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - Escaped property names", () => {
  const object = {"": 1, "quote-this": 2, noquotes: 3};
  const defaultOutput = "Object { \"\": 1, \"quote-this\": 2, noquotes: 3 }";

  it("renders object with escaped property names as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual("Object");
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - Nested", () => {
  const object = {
    objProp: {
      id: 1,
      arr: [2]
    },
    strProp: "test string",
    arrProp: [1]
  };
  const defaultOutput = "Object { strProp: \"test string\", objProp: Object," +
    " arrProp: [1] }";

  it("renders nested object as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual("Object");
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - More prop", () => {
  const object = {
    a: undefined,
    b: 1,
    "more": 2,
    d: 3
  };
  const defaultOutput = "Object { b: 1, more: 2, d: 3, more… }";

  it("renders object with more properties as expected", () => {
    expect(renderComponent(object, { mode: undefined }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY }).text())
      .toEqual("Object");
    expect(renderComponent(object, { mode: MODE.SHORT }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG }).text())
      .toEqual(defaultOutput);
  });
});

describe("Object - Custom Title", () => {
  const customTitle = "MyCustomObject";
  const object = {a: "a", b: "b", c: "c"};
  const defaultOutput = `${customTitle} { a: "a", b: "b", c: "c" }`;

  it("renders object with more properties as expected", () => {
    expect(renderComponent(
      object, { mode: undefined, title: customTitle}).text()
    ).toEqual(defaultOutput);
    expect(renderComponent(
      object, { mode: MODE.TINY, title: customTitle}).text()
    ).toEqual("MyCustomObject");
    expect(renderComponent(
      object, { mode: MODE.SHORT, title: customTitle }).text()
    ).toEqual(defaultOutput);
    expect(renderComponent(
      object, { mode: MODE.LONG, title: customTitle}).text()
    ).toEqual(defaultOutput);
  });
});

describe("Object - Object link", () => {
  const object = {
    a: undefined,
    b: 1,
    "more": 2,
    d: 3
  };
  const defaultOutput = "*Object** { *b: 1, more: 2, d: 3, *more…** }*";

  it("renders object with more properties as expected", () => {
    const objectLink = (props, ...children) => React.DOM.span({},
      "*", ...children, "*");

    expect(renderComponent(object, { mode: undefined, objectLink }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.TINY, objectLink }).text())
      .toEqual("*Object*");
    expect(renderComponent(object, { mode: MODE.SHORT, objectLink }).text())
      .toEqual(defaultOutput);
    expect(renderComponent(object, { mode: MODE.LONG, objectLink }).text())
      .toEqual(defaultOutput);
  });
});
