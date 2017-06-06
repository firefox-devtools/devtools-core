/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { tools: { makeBundle, copyFile }} = require("devtools-launchpad/index");
const path = require("path");
const fs = require("fs");

function start() {
  console.log("start: publish assets");
  const projectPath = path.resolve(__dirname, "..");

  const mochiDir = path.resolve(projectPath, "assets/build/mochitest");
  const buildDir = path.resolve(projectPath, "assets/build");
  const assetsDir = path.resolve(projectPath, "assets");

  console.log(assetsDir, buildDir, mochiDir);
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  if (!fs.existsSync(mochiDir)) {
    fs.mkdirSync(mochiDir);
  }

  copyFile(
    path.resolve(projectPath, "src/reps/reps.css"),
    path.resolve(projectPath, "assets/build/reps.css"),
    { cwd: projectPath }
  );

  copyFile(
    path.resolve(projectPath, "src/test/mochitest"),
    path.resolve(projectPath, "assets/build/mochitest"),
    { cwd: projectPath }
  );

  makeBundle({
    outputPath: `${projectPath}/assets/build`,
    projectPath
  }).then(() => {
    console.log("done: publish assets");
  });
}

start();
