// @flow

const { toServerLocation, fromServerLocation } = require("./create");

import type { Location } from "../types";
import type { ServerLocation, Agents } from "./types";

type setBreakpointResponseType = {
  breakpointId: string,
  serverLocation?: ServerLocation
}

let debuggerAgent;
let runtimeAgent;
let pageAgent;

function setupCommands({ Debugger, Runtime, Page }: Agents) {
  debuggerAgent = Debugger;
  runtimeAgent = Runtime;
  pageAgent = Page;
}

function resume() {
  return debuggerAgent.resume();
}

function stepIn() {
  return debuggerAgent.stepInto();
}

function stepOver() {
  return debuggerAgent.stepOver();
}

function stepOut() {
  return debuggerAgent.stepOut();
}

function pauseOnExceptions(toggle: boolean) {
  const state = toggle ? "uncaught" : "none";
  return debuggerAgent.setPauseOnExceptions(state);
}

function breakOnNext() {
  return debuggerAgent.pause();
}

function sourceContents(sourceId: string) {
  return debuggerAgent.getScriptSource({ scriptId: sourceId })
    .then(({ scriptSource }) => ({
      source: scriptSource,
      contentType: null
    }));
}

async function setBreakpoint(location: Location, condition: string) {
  let {
    breakpointId,
    serverLocation
  }: setBreakpointResponseType = await debuggerAgent.setBreakpoint({
    location: toServerLocation(location),
    columnNumber: location.column
  });

  const actualLocation = fromServerLocation(serverLocation) || location;

  return {
    id: breakpointId,
    actualLocation: actualLocation
  };
}

function removeBreakpoint(breakpointId: string) {
  return debuggerAgent.removeBreakpoint({ breakpointId });
}

function evaluate(script: string) {
  return runtimeAgent.evaluate({ expression: script });
}

function debuggeeCommand(script: string) {
  evaluate(script);
  return Promise.resolve();
}

function navigate(url: string) {
  return pageAgent.navigate({ url });
}

const clientCommands = {
  resume,
  stepIn,
  stepOut,
  stepOver,
  pauseOnExceptions,
  breakOnNext,
  sourceContents,
  setBreakpoint,
  removeBreakpoint,
  evaluate,
  debuggeeCommand,
  navigate
};

module.exports = {
  setupCommands,
  clientCommands
};
