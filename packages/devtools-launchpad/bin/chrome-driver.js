#!/usr/bin/env node

const spawn = require('child_process').spawn;
const minimist = require("minimist");

const chromeBinary = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
const args = minimist(process.argv.slice(2), {
  string: ["location"]
});

let chromeArgs = [
  "--remote-debugging-port=9222",
  "--no-first-run",
  "--user-data-dir=/tmp/chrome-dev-profile"
];

chromeArgs.push(args.location ? args.location : "about:blank");

const chrome = spawn(chromeBinary, chromeArgs);

chrome.stdout.on('data', data => console.log(`stdout: ${data}`));
chrome.stderr.on('data', data => console.log(`stderr: ${data}`));
chrome.on('close', code => console.log(`chrome exited with code ${code}`));
chrome.on('error', error => {
  if (error.code == "ENOENT") {
    console.log(`Hmm, could not find the path ${chromeBinary}.`)
    console.log(`Try looking for chrome with ls /Applications`)
    return;
  }

  console.log(error)
});
