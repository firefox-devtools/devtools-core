const ps = require("child_process");
const path = require("path");
const { isFirefoxRunning } = require("./utils/firefox");
const firefoxDriver = require("../../bin/firefox-driver");

function handleLaunchRequest(req, res) {
  const browser = req.body.browser;
  const location = "https://devtools-html.github.io/debugger-examples/";

  process.env.PATH += `:${__dirname}`;
  if (browser == "Firefox") {
    isFirefoxRunning().then((isRunning) => {
      console.log("running", isRunning);
      if (!isRunning) {
        firefoxDriver.start(location);
        res.end("launched firefox");
      } else {
        res.end("already running firefox");
      }
    });
  }

  if (browser == "Chrome") {
    ps.spawn(path.resolve(__dirname, "../../bin/chrome-driver.js"),
     ["--location", location]);
    res.end("launched chrome");
  }
}

module.exports = {
  handleLaunchRequest
};
