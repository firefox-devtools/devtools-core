const toolbox = require("../../../index");

let result = true;

function assert(expected, actual) {
  if (expected != actual) {
    console.warn(`Oops, ${expected} is different than ${actual}`);
    result = false;
  }
}

// NOTE: we can use a path function for this too
function getLocalPath(path) {
  return path.split("devtools-core")[1];
}

function testSimple() {
  const webpackConfig = {};
  const envConfig = {};
  const config = toolbox.toolboxConfig(webpackConfig, envConfig);

  assert(getLocalPath(config.context), "/packages/devtools-launchpad/src");
  const roots = config.resolveLoader.root;

  assert(getLocalPath(roots[0]), "/packages/devtools-launchpad/node_modules");
  assert(getLocalPath(roots[1]), "");
}

function testJsLoader() {
  const webpackConfig = {
    babelExcludes: /poop/
  };
  const envConfig = {};
  const config = toolbox.toolboxConfig(webpackConfig, envConfig);

  const loaders = config.module.loaders;
  const jsLoader = loaders[1];
  const jsExclude = jsLoader.exclude;
  // console.log(Object.values(loaders).map(l => l.test));

  assert(jsExclude("node_modules/foo"), true);
  assert(jsExclude("fs"), true);

  // NOTE: if fs appears in a module path it will excluded, which could be bad
  assert(jsExclude("fsoop"), true);
  assert(jsExclude("poop"), true);

  assert(jsExclude("node_modules/devtools-config"), false);
  assert(jsExclude("./foo"), false);

  // console.log(jsExclude("node_modules/foo") ? "yay" : "nay");
}

testSimple();
testJsLoader();

if (result) {
  process.exit();
} else {
  process.exit(1);
}
