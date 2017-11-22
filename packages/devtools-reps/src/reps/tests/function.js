/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global jest */
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
    expect(renderRep(object, {
      mode: MODE.TINY,
    }).text()).toBe("testName()");
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("testName(a, b, c)");

    expectActorAttribute(renderRep(object), object.actor);
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
    expect(renderRep(object, {
      mode: MODE.TINY,
    }).text()).toBe("testUserName()");
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("testUserName(a, b, c)");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
    }).text()).toBe("testVarName()");
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("testVarName(a, b, c)");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
    }).text()).toBe("()");
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("(a, b, c)");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
    }).text()).toBe(`${functionName}()`);
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe(`${functionName}(a, b, c)`);
  });
});

describe("Function - Async function", () => {
  const object = stubs.get("AsyncFunction");

  it("renders async function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("async function waitUntil2017()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("async waitUntil2017()");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("async waitUntil2017(a, b, c)");
  });
});

describe("Function - Anonymous async function", () => {
  const object = stubs.get("AnonAsyncFunction");

  it("renders anonymous async function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("async function ()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("async ()");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("async (a, b, c)");
  });
});

describe("Function - Generator function", () => {
  const object = stubs.get("GeneratorFunction");

  it("renders generator function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function* fib()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("* fib()");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("* fib(a, b, c)");
  });
});

describe("Function - Anonymous generator function", () => {
  const object = stubs.get("AnonGeneratorFunction");

  it("renders anonymous generator function as expected", () => {
    expect(renderRep(object, { mode: undefined }).text())
      .toBe("function* ()");
    expect(renderRep(object, { mode: MODE.TINY }).text())
      .toBe("* ()");
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
    expect(renderRep(object, {
      mode: MODE.TINY,
      parameterNames: ["a", "b", "c"]
    }).text()).toBe("* (a, b, c)");
  });
});

describe("Function - Jump to definition", () => {
  it("renders an icon when onViewSourceInDebugger props is provided", () => {
    const onViewSourceInDebugger = jest.fn();
    const object = stubs.get("Named");
    const renderedComponent = renderRep(object, {
      onViewSourceInDebugger
    });

    const node = renderedComponent.find(".jump-definition");
    node.simulate("click", {
      type: "click",
      stopPropagation: () => {},
    });

    expect(node.exists()).toBeTruthy();
    expect(onViewSourceInDebugger.mock.calls.length).toEqual(1);
    expect(onViewSourceInDebugger.mock.calls[0][0]).toEqual(object.location);
  });

  it("does not render an icon when onViewSourceInDebugger props is not provided", () => {
    const object = stubs.get("Named");
    const renderedComponent = renderRep(object);

    const node = renderedComponent.find(".jump-definition");
    expect(node.exists()).toBeFalsy();
  });

  it("does not render an icon when the object has no location", () => {
    const object = Object.assign({}, stubs.get("Named"));
    delete object.location;
    const renderedComponent = renderRep(object, {
      onViewSourceInDebugger: () => {}
    });

    const node = renderedComponent.find(".jump-definition");
    expect(node.exists()).toBeFalsy();
  });

  it("does not render an icon when the object has no url location", () => {
    const object = Object.assign({}, stubs.get("Named"));
    object.location.url = null;
    const renderedComponent = renderRep(object, {
      onViewSourceInDebugger: () => {}
    });

    const node = renderedComponent.find(".jump-definition");
    expect(node.exists()).toBeFalsy();
  });
});
