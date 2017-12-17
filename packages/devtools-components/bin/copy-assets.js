/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  tools: { makeBundle }
} = require("devtools-launchpad/index");
const fs = require("fs-extra");
const path = require("path");
const minimist = require("minimist");
const getConfig = require("./getConfig");
const { getValue, setConfig } = require("devtools-config");

const args = minimist(process.argv.slice(2), {
  boolean: ["watch", "symlink"]
});

async function start() {
  try {
    console.log("start: copy assets");
    const projectPath = path.resolve(__dirname, "..");
    const mcModulePath = "devtools/client/shared/components";

    const envConfig = getConfig();
    setConfig(envConfig);

    const mcPath = getValue("firefox.mcPath");

    console.log("  output path is:", mcPath);

    console.log("  creating devtools-components.js bundle...");
    await makeBundle({
      outputPath: path.join(mcPath, mcModulePath),
      projectPath,
      watch: args.watch
    });
    console.log("  remove build artifacts...");
    fs.removeSync(path.join(mcPath, mcModulePath, "devtools-components.js.map"));
    console.log("done: copy assets");
  } catch (e) {
    console.error(e);
  }
}

start();
