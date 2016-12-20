const ps = require("child_process");

function copyFile(src, dest, { cwd }) {
  ps.execSync(`cp -r ${src} ${dest}`, { cwd });
}

module.exports = copyFile;
