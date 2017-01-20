const fs = require("fs-extra");

function copyFile(src, dest, { cwd }) {
  fs.copySync(src, dest);
}

module.exports = copyFile;
