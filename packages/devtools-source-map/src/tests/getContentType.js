const { getContentType, contentMapForTesting } = require("../util");

test("getContentType", () => {
  for (let ext in contentMapForTesting) {
    expect(getContentType(`whatever.${ext}`))
      .toEqual(contentMapForTesting[ext]);
    expect(getContentType(`whatever${ext}`))
      .toEqual("text/plain");
  }
  expect(getContentType("whatever.platypus")).toEqual("text/plain");
});
