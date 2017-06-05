const fs = require("fs");
const path = require("path");
const parse = require("yarn/lib/lockfile/parse.js").default;

function isUnique(list) {
  const set = new Set(list);
  return set.size == list.length;
}

const lockFilePath = path.normalize(path.join(__dirname, "..", "yarn.lock"));
const lockfile = fs.readFileSync(lockFilePath).toString();

const parsed = parse(lockfile);
const devtoolDeps = Object.keys(parsed).filter(dep => dep.match(/^devtools-/));

// check for duplicate dependencies
const depsList = devtoolDeps.map(dep => dep.replace(/@.*/, ""));
const hasDuplicates = !isUnique(depsList);

if (hasDuplicates) {
  console.warn(`Oops, it looks like there's duplicate dependencies:\n\n${devtoolDeps.join("\n")}\n\nCheck your yarn.lock file for the discrepancy.`);
  process.exit(1);
}
