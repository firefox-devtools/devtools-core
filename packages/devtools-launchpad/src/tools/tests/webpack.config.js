const toolbox = require("../../../index");

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
      "/packages/devtools-launchpad/src"
    );

    const roots = config.resolveLoader.root;
    expect(getLocalPath(roots[0])).toBe(
      "/packages/devtools-launchpad/node_modules"
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
