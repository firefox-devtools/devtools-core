#!/usr/bin/env node

const spawn = require('child_process').spawn;
const minimist = require("minimist");
<<<<<<< HEAD
const os = require("os");

const isWindows = /^win/.test(process.platform);

const chromeBinary = isWindows ?
  "c:\\program files (x86)\\google\\chrome\\application\\chrome.exe" :
  "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome";

=======
const os = require('os');

const chromeBinary = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
const chromeBinaryWindows = 
      "c:\\program files (x86)\\google\\chrome\\application\\chrome.exe"
>>>>>>> 665e4092ed16e57ab687a46ae9b2f8d7b71fdf0c
const args = minimist(process.argv.slice(2), {
  string: ["location"]
});

let chromeArgs = [
  "--remote-debugging-port=9222",
  "--no-first-run",
  `--user-data-dir=${os.tmpdir()}/chrome-dev-profile`
];

let chromeArgsWindows = [
  "--remote-debugging-port=9222",
  "--no-first-run",
  "--user-data-dir=" + os.tmpdir() + "\\chrome-dev-profile"
];

const isWindows = /^win/.test(process.platform);

chromeArgs.push(args.location ? args.location : "about:blank");

const chrome = isWindows ? spawn(chromeBinaryWindows, chromeArgsWindows) : spawn(chromeBinary, chromeArgs);

chrome.stdout.on('data', data => console.log(`stdout: ${data}`));
chrome.stderr.on('data', data => console.log(`stderr: ${data}`));
chrome.on('close', code => console.log(`chrome exited with code ${code}`));
chrome.on('error', error => {
  if (error.code == "ENOENT") {
    console.log(`Hmm, could not find the path ${chromeBinary}.`);
    console.log("Try looking for chrome with ls /Applications");

    return;
  }

  console.log(error);
});
