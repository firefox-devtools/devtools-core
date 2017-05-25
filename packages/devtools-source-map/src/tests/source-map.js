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
      sourceMapURL: "bundle.js.map"
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
      sourceMapURL: "bundle.js.map"
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
});
