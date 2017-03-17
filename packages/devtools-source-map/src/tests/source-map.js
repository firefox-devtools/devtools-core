const fs = require("fs");
const path = require("path");

jest.mock("devtools-network-request");
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

    require("devtools-network-request").mockImplementationOnce(() => {
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
});
