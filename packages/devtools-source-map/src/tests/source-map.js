/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");

jest.mock("devtools-utils/src/network-request");
const {
  getOriginalURLs,
  hasMappedSource,
  getOriginalLocation,
  getGeneratedLocation
} = require("../source-map");

function getMap(_path) {
  const mapPath = path.join(__dirname, _path);
  return fs.readFileSync(mapPath, "utf8");
}

async function setupBundleFixture() {
  const source = {
    id: "bundle.js",
    sourceMapURL: "bundle.js.map",
    url: "http:://example.com/bundle.js"
  };

  require("devtools-utils/src/network-request").mockImplementationOnce(() => {
    const content = getMap("fixtures/bundle.js.map");
    return { content };
  });

  await getOriginalURLs(source);
}

describe("source maps", () => {
  test("getOriginalURLs", async () => {
    const source = {
      id: "bundle.js",
      sourceMapURL: "bundle.js.map",
      url: "http:://example.com/bundle.js"
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
    expect(urls).toEqual(["http://example.com/cheese/heart.js"]);
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
    expect(urls).toEqual(["http://example.com/whatever/heart.js"]);
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
    expect(urls).toEqual(["http://example.com/whatever/heart.js"]);
  });

  describe("hasMappedSource", async () => {
    test("has original location", async () => {
      await setupBundleFixture();
      const location = {
        sourceId: "bundle.js",
        line: 49
      };
      const isMapped = await hasMappedSource(location);
      expect(isMapped).toBe(true);
    });

    test("does not have original location", async () => {
      const location = {
        sourceId: "bundle.js",
        line: 94
      };
      const isMapped = await hasMappedSource(location);
      expect(isMapped).toBe(false);
    });
  });

  describe("getOriginalLocation", async () => {
    test("maps a generated location", async () => {
      await setupBundleFixture();
      const location = {
        sourceId: "bundle.js",
        line: 49
      };

      const originalLocation = await getOriginalLocation(location);
      expect(originalLocation).toEqual({
        column: 0,
        line: 3,
        sourceId: "bundle.js/originalSource-fe2c41d3535b76c158e39ba4f3ff826a",
        sourceUrl: "webpack:///entry.js"
      });
    });

    test("does not map an original location", async () => {
      const location = {
        column: 0,
        line: 3,
        sourceId: "bundle.js/originalSource-fe2c41d3535b76c158e39ba4f3ff826a",
        sourceUrl: "webpack:///entry.js"
      };
      const originalLocation = await getOriginalLocation(location);
      expect(originalLocation).toEqual(originalLocation);
    });
  });

  describe("getGeneratedLocation", async () => {
    test("maps an original location", async () => {
      await setupBundleFixture();
      const location = {
        column: 0,
        line: 3,
        sourceId: "bundle.js/originalSource-fe2c41d3535b76c158e39ba4f3ff826a"
      };

      const source = {
        url: "webpack:///entry.js",
        id: "bundle.js/originalSource-fe2c41d3535b76c158e39ba4f3ff826a"
      };

      const generatedLocation = await getGeneratedLocation(location, source);
      expect(generatedLocation).toEqual({
        sourceId: "bundle.js",
        line: 49
      });
    });

    test("does not map an original location", async () => {
      const location = {
        column: 0,
        line: 3,
        sourceId: "bundle.js/originalSource-fe2c41d3535b76c158e39ba4f3ff826a",
        sourceUrl: "webpack:///entry.js"
      };

      const source = {
        url: "webpack:///entry.js",
        id: "bundle.js/originalSource-fe2c41d3535b76c158e39ba4f3ff826a"
      };

      const generatedLocation = await getGeneratedLocation(location, source);
      expect(generatedLocation).toEqual(generatedLocation);
    });
  });

  describe("Error handling", async () => {
    const source = {
      id: "missingmap.js",
      sourceMapURL: "missingmap.js.map",
      url: "http:://example.com/missingmap.js"
    };

    require("devtools-utils/src/network-request").mockImplementationOnce(() => {
      throw new Error("Not found");
    });

    let thrown = false;
    try {
      await getOriginalURLs(source);
    } catch (e) {
      thrown = true;
    }
    expect(thrown).toBe(true);

    const location = {
      sourceId: "missingmap.js",
      line: 49
    };

    thrown = false;
    try {
      await getOriginalLocation(location);
    } catch (e) {
      thrown = true;
    }
    expect(thrown).toBe(false);
  });
});
