/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { shallow } = require("enzyme");

const {
  REPS,
  getRep,
} = require("../rep");

const { MODE } = require("../constants");
const { Rep, CommentNode } = REPS;
const stubs = require("../stubs/comment-node");

describe("test CommentNode", () => {
  const stub = stubs.get("Comment");

  it("selects CommentNode Rep correctly", () => {
    expect(getRep(stub)).toEqual(CommentNode.rep);
  });

  it("renders with correct class names", () => {
    const renderedComponent = shallow(Rep({
      object: stub
    }));

    expect(renderedComponent.hasClass("objectBox theme-comment")).toBe(true);
  });

  it("renders as expected", () => {
    const object = stubs.get("Comment");
    const renderRep = props => shallow(CommentNode.rep(Object.assign({object}, props)));

    expect(renderRep({mode: undefined}).text())
      .toEqual(`<!-- test\nand test\nand test\nan…d test\nand test\nand test -->`);
    expect(renderRep({mode: MODE.TINY}).text())
      .toEqual(`<!-- test\\nand test\\na… test\\nand test -->`);
    expect(renderRep({mode: MODE.LONG}).text())
      .toEqual(`<!-- ${stub.preview.textContent} -->`);
  });
});
