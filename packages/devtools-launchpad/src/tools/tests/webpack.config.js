/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const toolbox = require("../../../index");
const path = require("path");

// NOTE: we can likely switch this out for an appropriate path function
function getLocalPath(filepath) {
  return filepath.split("devtools-core")[1];
}

describe("Webpack config", () => {
  it("default config", () => {
    const webpackConfig = {};
    const envConfig = {};
    const config = toolbox.toolboxConfig(webpackConfig, envConfig);

    expect(getLocalPath(config.context)).toBe(
      path.normalize("/packages/devtools-launchpad/src")
    );

    const roots = config.resolveLoader.root;
    expect(getLocalPath(roots[0])).toBe(
      path.normalize("/packages/devtools-launchpad/node_modules")
    );
  });

  it("JS excludes rules", () => {
    const webpackConfig = {
      babelExcludes: /poop/
    };
    const envConfig = {};
    const config = toolbox.toolboxConfig(webpackConfig, envConfig);

    const loaders = config.module.loaders;
    const jsLoader = loaders[1];
    const jsExclude = jsLoader.exclude;
    // console.log(Object.values(loaders).map(l => l.test));

    expect(jsExclude("node_modules/foo")).toBe(true);
    expect(jsExclude("fs")).toBe(true);

    // NOTE: if fs appears in a module path it will excluded, which could be bad
    expect(jsExclude("fsoop")).toBe(true);
    expect(jsExclude("poop")).toBe(true);

    expect(jsExclude("node_modules/devtools-config")).toBe(false);
    expect(jsExclude("./foo")).toBe(false);
  });
});
