/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { shallow } = require("enzyme");

const {
  REPS,
  getRep,
} = require("../rep");

let { RegExp, Rep } = REPS;

const stubs = require("../stubs/failure");

describe("test Failure", () => {
  const stub = stubs.get("Failure");

  it("Rep correctly selects RegExp Rep", () => {
    expect(getRep(stub)).toBe(RegExp.rep);
  });

  it("Fallback rendering has expected text content", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));
    expect(renderedComponent.text()).toEqual("Invalid object");
  });

  it("Fallback rendering has expected text content", () => {
    const renderedComponent = shallow(Rep({
      object: [1, stub, 2]
    }));
    expect(renderedComponent.text()).toEqual("[ 1, Invalid object, 2 ]");
  });
});
