/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  createNode,
  NODE_TYPES,
} = require("../../utils/node");

describe("createNode", () => {
  it("returns null when contents is undefined", () => {
    expect(createNode(null, "name", "path")).toBeNull();
  });

  it("does not return null when contents is null", () => {
    expect(createNode(null, "name", "path", null)).toEqual({
      parent: null,
      name: "name",
      path: "path",
      contents: null,
      type: NODE_TYPES.GRIP
    });
  });

  it("returns the expected object when parent is null", () => {
    expect(createNode(null, "name", "path", "contents")).toEqual({
      parent: null,
      name: "name",
      path: "path",
      contents: "contents",
      type: NODE_TYPES.GRIP
    });
  });

  it("returns the expected object when parent is not null", () => {
    const root = createNode(null, "name", "path", null);
    expect(createNode(root, "name", "path", "contents")).toEqual({
      parent: root,
      name: "name",
      path: "path",
      contents: "contents",
      type: NODE_TYPES.GRIP
    });
  });

  it("returns the expected object when type is not undefined", () => {
    const root = createNode(null, "name", "path", null);
    expect(createNode(root, "name", "path", "contents", NODE_TYPES.BUCKET)).toEqual({
      parent: root,
      name: "name",
      path: "path",
      contents: "contents",
      type: NODE_TYPES.BUCKET
    });
  });
});
