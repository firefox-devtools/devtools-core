const fs = require("fs");
const path = require("path");
const feature = require("devtools-config");
const toolbox = require("../index");
const express = require("express");

const envConfig = toolbox.developmentConfig;
feature.setConfig(envConfig);

function buildwebpackConfig(envConfig) {
  let webpackConfig = {
    entry: {
      launchpad: path.join(__dirname, "../src/main")
    },

    output: {
      path: path.join(__dirname, "assets/build"),
      filename: "[name].js",
      publicPath: "/assets/build",
      libraryTarget: "umd"
    },

    resolve: {
      alias: {
        "react-dom": "react-dom/dist/react-dom"
      }
    }
  }

  const config = toolbox.toolboxConfig(webpackConfig, envConfig);
  return config
}

const webpackConfig = buildwebpackConfig(envConfig);
let { app } = toolbox.startDevServer(envConfig, webpackConfig, __dirname);
