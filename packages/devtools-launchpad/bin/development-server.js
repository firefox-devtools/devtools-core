#!/usr/bin/env node

"use strict";

require("babel-register");

const path = require("path");
const fs = require("fs");
const ps = require("child_process");
const Mustache = require("mustache");
const webpack = require("webpack");
const express = require("express");
const bodyParser = require("body-parser");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const http = require("http");
const https = require("https");
const checkNode = require("check-node-version");
const {
  setConfig,
  getConfig,
  updateLocalConfig,
  getValue,
  setValue
} = require("devtools-config");
const isDevelopment = require("devtools-config").isDevelopment;
const firefoxDriver = require("./firefox-driver");
var psLookup = require("ps-node");

let root;

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
          console.log('found process', process)
          if (args.match(/--start-debugger-server=6080/)) {
            isRunning = true;
          }
        } else {
        }
      });

      resolve(isRunning);
    });
  });
}

function httpOrHttpsGet(url, onResponse) {
  let protocol = url.startsWith("https:") ? https : http;

  return protocol.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`error response: ${response.statusCode} to ${url}`);
      response.emit("statusCode", new Error(response.statusCode));
      return onResponse("{}");
    }
    let body = "";
    response.on("data", function(d) {
      body += d;
    });
    response.on("end", () => onResponse(body));
  });
}

function getFavicon() {
  let favicon = getValue("favicon");

  if (!favicon) {
    return "launchpad-favicon.png";
  }

  return path.basename(favicon);
}

function serveRoot(req, res) {
  const tplPath = path.join(__dirname, "../index.html");
  const tplFile = fs.readFileSync(tplPath, "utf8");
  const bundleName = getValue("title") ?
    getValue("title").toLocaleLowerCase() : "bundle";

  res.send(Mustache.render(tplFile, {
    isDevelopment: isDevelopment(),
    dir: getValue("dir") || "ltr",
    bundleName,
    title: getValue("title") || "Launchpad",
    favicon: getFavicon()
  }));
}

function handleNetworkRequest(req, res) {
  const url = req.query.url;
  if (url.indexOf("file://") === 0) {
    const path = url.replace("file://", "");
    res.json(JSON.parse(fs.readFileSync(path, "utf8")));
  }
  else {
    const httpReq = httpOrHttpsGet(
      req.query.url,
      body => {
        try {
          res.send(body);
        } catch (e) {
          res.status(500).send("Malformed json");
        }
      }
    );

    httpReq.on("error", err => res.status(500).send(err.code));
    httpReq.on("statusCode", err => res.status(err.message).send(err.message));
  }
}

function handleLaunchRequest(req, res) {
  const browser = req.body.browser;
  const location = "https://devtools-html.github.io/debugger-examples/";

  process.env.PATH += `:${__dirname}`;
  if (browser == "Firefox") {
    isFirefoxRunning().then((isRunning) => {
      console.log('running', isRunning)
      if (!isRunning) {
        firefoxDriver.start(location);
        res.end('launched firefox');
      } else {
        res.end('already running firefox')
      }
    })
  }

  if (browser == "Chrome") {
    ps.spawn("chrome-driver.js", ["--location", location]);
    res.end('launched chrome');
  }
}

function handleGetConfig(req, res) {
  res.json(getConfig());
}

function handleSetConfig(req, res) {
  const params = req.body;
  setValue(params.path, params.value);
  const output = updateLocalConfig(root);

  res.end(output);
}

function onRequest(err, result) {
  const serverPort = getValue("development.serverPort");

  if (err) {
    console.log(err);
  } else {
    console.log(`Development Server Listening at http://localhost:${serverPort}`);
  }
}

function startDevServer(devConfig, webpackConfig, rootDir) {
  setConfig(devConfig);
  root = rootDir;
  checkNode(">=6.9.0", function(_, opts) {
    if (!opts.nodeSatisfied) {
      const version = opts.node.raw;
      console.log(`Sorry, Your version of node is ${version}.`);
      console.log("The minimum requirement is >=6.9.0");
      exit();
    }
  });

  if (!getValue("firefox.webSocketConnection")) {
    const firefoxProxy = require("./firefox-proxy");
    firefoxProxy({ logging: getValue("logging.firefoxProxy") });
  }

  // setup app
  const app = express();

  app.use(express.static("assets/build"));

  let favicon = getValue("favicon");
  let faviconDir = favicon
    ? path.dirname(path.join(rootDir, favicon))
    : path.join(__dirname, '../assets')

  app.use(express.static(faviconDir));

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  if (!getValue("development.customIndex")) {
    app.get("/", serveRoot);
  }

  app.get("/get", handleNetworkRequest);
  app.post("/launch", handleLaunchRequest);
  app.get("/getconfig", handleGetConfig);
  app.post("/setconfig", handleSetConfig);

  const serverPort = getValue("development.serverPort");
  app.listen(serverPort, "0.0.0.0", onRequest);

  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: { colors: true }
  }));

  if (getValue("hotReloading")) {
    app.use(webpackHotMiddleware(compiler));
  } else {
    console.log("Hot Reloading - https://github.com/devtools-html/debugger.html/blob/master/docs/local-development.md#hot-reloading");
  }

  return { express, app }
}

module.exports = {
  startDevServer
}
