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

function symlinkTests({ projectPath, mcModulePath }) {
  const projectMochitestPath =
    `${projectPath}/src/test/mochitest`;
  const mcMochitestPath =
    `${projectPath}/firefox/${mcModulePath}/test/mochitest`;

  rm(mcMochitestPath, { cwd: projectPath });

  symlink(
    projectMochitestPath,
    mcMochitestPath,
    { cwd: projectPath }
  );
}

module.exports = symlinkTests;
