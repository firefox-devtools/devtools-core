module.exports = function processHandler({ proc, name, resolve, reject }) {
  console.log(`starting: ${name}`);

  proc.stdout.on("data", data => console.log(`${data}`));
  proc.stderr.on("data", data => console.log(`stderr: ${data}`));

  proc.on("close", (code) => {
    console.log(`finished: ${name}`);

    if (code === 0) {
      resolve();
    } else {
      console.log(`${name}: exited with code ${code}`);
      reject();
    }
  });
};
