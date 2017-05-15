const { isURL } = require("../path");

test("isURL", () => {
  expect(isURL("http://www.example.com/")).toEqual(true);
  expect(isURL("www.example.com/")).toEqual(false);
  expect(isURL("data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D")).toEqual(true);
});
