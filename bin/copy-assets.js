const { tools: { makeBundle, symlinkTests, copyFile }} = require("devtools-launchpad/index");
const path = require("path");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2), {
  boolean: ["watch"],
});

function start() {
  console.log("start: copy assets");
  const projectPath = path.resolve(__dirname, "..");
  const mcModulePath = "devtools/client/shared/components/reps";
  const mcPath = "./firefox";

  symlinkTests({ projectPath, mcModulePath });

  copyFile(
    path.join(projectPath, "./assets/build/load-reps.js"),
    path.join(mcPath, mcModulePath, "load-reps.js"),
    {cwd: projectPath}
  );

  copyFile(
    path.join(projectPath, "./assets/build/reps.css"),
    path.join(mcPath, mcModulePath, "reps.css"),
    {cwd: projectPath}
  );

  makeBundle({
    outputPath: path.join(projectPath, mcPath, mcModulePath),
    projectPath,
    watch: args.watch
  }).then(() => {
    console.log("done: copy assets");
  });
}

start();
