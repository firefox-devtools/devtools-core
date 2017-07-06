/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { shallow } = require("enzyme");
const { REPS } = require("../rep");
const { MODE } = require("../constants");
const { Func } = REPS;
const stubs = require("../stubs/function");
const {
  expectActorAttribute
} = require("./test-helpers");
const renderRep = (object, props) => {
  return shallow(Func.rep(Object.assign({object}, props)));
};

describe("Function - Named", () => {
  // Test declaration: `function testName() { let innerVar = "foo" }`
  const object = stubs.get("Named");

  it("renders named function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function testName()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("function testName()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("function testName(a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("function testName(a, b, c)");

    expectActorAttribute(renderRep(object), object.actor);
  });

  it("renders as expected with object link", () => {
    const renderedComponent = renderRep(object, {
      objectLink: (props, ...children) => React.DOM.span({},
        "*", ...children, "*")
    });

    expect(renderedComponent.text()).toBe("*function *testName()");
  });
});

describe("Function - User named", () => {
  // Test declaration: `function testName() { let innerVar = "foo" }`
  const object = stubs.get("UserNamed");

  it("renders user named function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function testUserName()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("function testUserName()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("function testUserName(a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("function testUserName(a, b, c)");
  });
});

describe("Function - Var named", () => {
  // Test declaration: `let testVarName = function() { }`
  const object = stubs.get("VarNamed");

  it("renders var named function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function testVarName()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("function testVarName()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("function testVarName(a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("function testVarName(a, b, c)");
  });
});

describe("Function - Anonymous", () => {
  // Test declaration: `() => {}`
  const object = stubs.get("Anon");

  it("renders anonymous function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function ()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("function ()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("function (a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("function (a, b, c)");
  });
});

describe("Function - Long name", () => {
  // eslint-disable-next-line max-len
  // Test declaration: `let f = function loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong() { }`
  const object = stubs.get("LongName");
  const functionName = "looooooooooooooooooooooooooooooooooooooooooooooo" +
    "oo\u2026ooooooooooooooooooooooooooooooooooooooooooooooong";

  it("renders long name function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe(`function ${functionName}()`);
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe(`function ${functionName}()`);
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe(`function ${functionName}(a)`);
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe(`function ${functionName}(a, b, c)`);
  });
});

describe("Function - Async function", () => {
  const object = stubs.get("AsyncFunction");

  it("renders async function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("async function waitUntil2017()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("async function waitUntil2017()");
    expect(renderRep(object, { mode: MODE.SHORT }).text())
      .toBe("async function waitUntil2017()");
    expect(renderRep(object, { mode: MODE.LONG }).text())
      .toBe("async function waitUntil2017()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("async function waitUntil2017()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("async function waitUntil2017(a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("async function waitUntil2017(a, b, c)");
  });
});

describe("Function - Anonymous async function", () => {
  const object = stubs.get("AnonAsyncFunction");

  it("renders anonymous async function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("async function ()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("async function ()");
    expect(renderRep(object, { mode: MODE.SHORT }).text())
      .toBe("async function ()");
    expect(renderRep(object, { mode: MODE.LONG }).text())
      .toBe("async function ()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("async function ()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("async function (a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("async function (a, b, c)");
  });
});

describe("Function - Generator function", () => {
  const object = stubs.get("GeneratorFunction");

  it("renders generator function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function* fib()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("function* fib()");
    expect(renderRep(object, { mode: MODE.SHORT }).text())
      .toBe("function* fib()");
    expect(renderRep(object, { mode: MODE.LONG }).text())
      .toBe("function* fib()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("function* fib()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("function* fib(a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("function* fib(a, b, c)");
  });
});

describe("Function - Anonymous generator function", () => {
  const object = stubs.get("AnonGeneratorFunction");

  it("renders anonymous generator function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function* ()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("function* ()");
    expect(renderRep(object, { mode: MODE.SHORT }).text())
      .toBe("function* ()");
    expect(renderRep(object, { mode: MODE.LONG }).text())
      .toBe("function* ()");
    expect(renderRep(object, { parameterNames: [] }).text())
      .toBe("function* ()");
    expect(renderRep(object, { parameterNames: ["a"] }).text())
      .toBe("function* (a)");
    expect(renderRep(object, { parameterNames: ["a", "b", "c"] }).text())
      .toBe("function* (a, b, c)");
  });
});
