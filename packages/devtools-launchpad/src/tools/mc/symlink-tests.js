/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const ps = require("child_process");

function symlink(src, dest, { cwd }) {
  ps.execSync(`ln -s ${src} ${dest}`, {
    cwd
  });
}

function rm(file, { cwd }) {
  ps.execSync(`rm -r ${file}`, {
    cwd
  });
}

/**
 * Symlink tests between a project using devtools-launchpad and a working
 * mozilla-central clone.
 *
 * @param {String} projectPath
 *        Path to the current project working dir.
 * @param {String} projectTestPath
 *        Path to the source test folder (should be located in project).
 * @param {String} mcTestPath
 *        Path to the target test folder (should be located in mozilla-central
 *        clone).
 * @param {String} (deprecated) mcModulePath
 */
function symlinkTests({ projectPath, projectTestPath, mcTestPath,
  mcModulePath }) {
  // Backwards compatibility.
  if (mcModulePath && !projectTestPath && !mcTestPath) {
    console.error("mcModulePath is deprecated, please define projectTestPath" +
      " and mcTestPath");
    projectTestPath = `${projectPath}/src/test/mochitest`;
    mcTestPath = `${projectPath}/firefox/${mcModulePath}/test/mochitest`;
  }

  rm(mcTestPath, { cwd: projectPath });

  symlink(
    projectTestPath,
    mcTestPath,
    { cwd: projectPath }
  );
}

module.exports = symlinkTests;
