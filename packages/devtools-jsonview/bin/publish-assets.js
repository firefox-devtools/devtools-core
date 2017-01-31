/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { tools: { makeBundle }} = require("devtools-launchpad/index");
const path = require("path");

function start() {
  console.log("start: publish assets");
  const projectPath = path.resolve(__dirname, "..");

  makeBundle({
    outputPath: `${projectPath}/assets/build`,
    projectPath
  }).then(() => {
    console.log("done: publish assets");
  });
}

start();
