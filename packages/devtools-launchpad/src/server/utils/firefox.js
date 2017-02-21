const psLookup = require("ps-node");

function isFirefoxRunning() {
  return new Promise((resolve, reject) => {
    let isRunning = false;
    psLookup.lookup({
      command: "firefox-bin",
    }, function(err, resultList) {
      if (err) {
        throw new Error(err);
      }

      resultList.forEach(function(process) {
        if (process) {
          const args = process.arguments.join(" ");
          console.log("found process", process);
          if (args.match(/--start-debugger-server=6080/)) {
            isRunning = true;
          }
        }
      });

      resolve(isRunning);
    });
  });
}

module.exports = {
  isFirefoxRunning
};
