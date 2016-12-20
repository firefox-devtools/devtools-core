const makeBundle = require("./mc/make-bundle");
const symlinkTests = require("./mc/symlink-tests");
const copyFile = require("./utils/copy-file");

module.exports = {
  copyFile,
  makeBundle,
  symlinkTests
};
