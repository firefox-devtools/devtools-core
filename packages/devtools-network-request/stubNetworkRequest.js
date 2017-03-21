module.exports = function(url) {
  const fs = require("fs");
  const _path = require("path");

  return new Promise((resolve, reject) => {
    // example.com is used at a dummy URL that points to our local
    // `/src` folder.
    url = url.replace(/http:\/\/localhost:8000/, "");
    const requestUrl = _path.join(__dirname, "../src/test/mochitest/", url);
    const content = fs.readFileSync(requestUrl, "utf8");

    resolve({ content });
  });
};
