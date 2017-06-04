/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");

jest.mock("devtools-utils/src/network-request");
const { getOriginalURLs } = require("../source-map");

function getMap(_path) {
  const mapPath = path.join(__dirname, _path);
  return fs.readFileSync(mapPath, "utf8");
}

describe("source maps", () => {
  test("getOriginalURLs", async () => {
    const source = {
      id: "bundle.js",
      sourceMapURL: "bundle.js.map",
      url: "http:://example.com/bundle.js",
    };

    require("devtools-utils/src/network-request").mockImplementationOnce(() => {
      const content = getMap("fixtures/bundle.js.map");
      return { content };
    });

    const urls = await getOriginalURLs(source);
    expect(urls).toEqual([
      "webpack:/webpack/bootstrap 4ef8c7ec7c1df790781e",
      "webpack:///entry.js",
      "webpack:///times2.js",
      "webpack:///output.js",
      "webpack:///opts.js"
    ]);
  });

  test("URL resolution", async () => {
    const source = {
      id: "absolute.js",
      sourceMapURL: "absolute.js.map"
    };

    require("devtools-utils/src/network-request").mockImplementationOnce(() => {
      const content = getMap("fixtures/absolute.js.map");
      return { content };
    });

    const urls = await getOriginalURLs(source);
    expect(urls).toEqual([
      "http://example.com/cheese/heart.js"
    ]);
  });

  test("Empty sourceRoot resolution", async () => {
    const source = {
      id: "empty.js",
      url: "http://example.com/whatever/empty.js",
      sourceMapURL: "empty.js.map"
    };

    require("devtools-utils/src/network-request").mockImplementationOnce(() => {
      const content = getMap("fixtures/empty.js.map");
      return { content };
    });

    const urls = await getOriginalURLs(source);
    expect(urls).toEqual([
      "http://example.com/whatever/heart.js"
    ]);
  });

  test("Non-existing sourceRoot resolution", async () => {
    const source = {
      id: "noroot.js",
      url: "http://example.com/whatever/noroot.js",
      sourceMapURL: "noroot.js.map"
    };

    require("devtools-utils/src/network-request").mockImplementationOnce(() => {
      const content = getMap("fixtures/noroot.js.map");
      return { content };
    });

    const urls = await getOriginalURLs(source);
    expect(urls).toEqual([
      "http://example.com/whatever/heart.js"
    ]);
  });
});
