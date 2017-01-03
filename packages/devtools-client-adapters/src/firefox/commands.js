const { BreakpointResult, Location } = require("../tcomb-types");
const defer = require("../utils/defer");

let bpClients;
let threadClient;
let tabTarget;
let debuggerClient;
let propertiesRequestCache = new Set();

function setupCommands(dependencies) {
  threadClient = dependencies.threadClient;
  tabTarget = dependencies.tabTarget;
  debuggerClient = dependencies.debuggerClient;
  bpClients = {};
}

function resume() {
  return new Promise(resolve => {
    threadClient.resume(resolve);
  });
}

function stepIn() {
  return new Promise(resolve => {
    threadClient.stepIn(resolve);
  });
}

function stepOver() {
  return new Promise(resolve => {
    threadClient.stepOver(resolve);
  });
}

function stepOut() {
  return new Promise(resolve => {
    threadClient.stepOut(resolve);
  });
}

function breakOnNext() {
  return threadClient.breakOnNext();
}

function sourceContents(sourceId) {
  const sourceClient = threadClient.source({ actor: sourceId });
  return sourceClient.source();
}

function setBreakpoint(location, condition, noSliding) {
  const sourceClient = threadClient.source({ actor: location.sourceId });

  return sourceClient.setBreakpoint({
    line: location.line,
    column: location.column,
    condition,
    noSliding
  }).then((res) => onNewBreakpoint(location, res));
}

function onNewBreakpoint(location, res) {
  const bpClient = res[1];
  let actualLocation = res[0].actualLocation;
  bpClients[bpClient.actor] = bpClient;

  // Firefox only returns `actualLocation` if it actually changed,
  // but we want it always to exist. Format `actualLocation` if it
  // exists, otherwise use `location`.
  actualLocation = actualLocation ? {
    sourceId: actualLocation.source.actor,
    line: actualLocation.line,
    column: actualLocation.column
  } : location;

  return BreakpointResult({
    id: bpClient.actor,
    actualLocation: Location(actualLocation)
  });
}

function removeBreakpoint(breakpointId) {
  const bpClient = bpClients[breakpointId];
  bpClients[breakpointId] = null;
  return bpClient.remove();
}

function setBreakpointCondition(breakpointId, location, condition, noSliding) {
  let bpClient = bpClients[breakpointId];
  bpClients[breakpointId] = null;

  return bpClient.setCondition(threadClient, condition, noSliding)
    .then(_bpClient => onNewBreakpoint(location, [{}, _bpClient]));
}

function evaluate(script, { frameId }) {
  const params = frameId ? { frameActor: frameId } : {};
  const deferred = defer();

  tabTarget.activeConsole.evaluateJS(script, (result) => {
    deferred.resolve(result);
  }, params);

  return deferred.promise;
}

function debuggeeCommand(script) {
  tabTarget.activeConsole.evaluateJS(script, () => {});

  const consoleActor = tabTarget.form.consoleActor;
  const request = debuggerClient._activeRequests.get(consoleActor);
  request.emit("json-reply", {});
  debuggerClient._activeRequests.delete(consoleActor);

  return Promise.resolve();
}

function navigate(url) {
  return tabTarget.activeTab.navigateTo(url);
}

function reload() {
  return tabTarget.activeTab.reload();
}

function getProperties(grip) {
  if (propertiesRequestCache.has(grip.actor)) {
    return Promise.resolve();
  }

  propertiesRequestCache.add(grip.actor);
  const objClient = threadClient.pauseGrip(grip);

  return objClient.getPrototypeAndProperties().then(resp => {
    return resp;
  });
}

function pauseOnExceptions(
  shouldPauseOnExceptions, shouldIgnoreCaughtExceptions) {
  return threadClient.pauseOnExceptions(
    shouldPauseOnExceptions,
    shouldIgnoreCaughtExceptions
  );
}

function prettyPrint(sourceId, indentSize) {
  const sourceClient = threadClient.source({ actor: sourceId });
  return sourceClient.prettyPrint(indentSize);
}

function disablePrettyPrint(sourceId) {
  const sourceClient = threadClient.source({ actor: sourceId });
  return sourceClient.disablePrettyPrint();
}

function recordCoverage() {
  return new Promise(resolve => {
    threadClient.recordCoverage(resolve);
  });
}

function interrupt() {
  return threadClient.interrupt();
}

function eventListeners() {
  return threadClient.eventListeners();
}

function pauseGrip(func) {
  return threadClient.pauseGrip(func);
}

const clientCommands = {
  interrupt,
  eventListeners,
  pauseGrip,
  resume,
  stepIn,
  stepOut,
  stepOver,
  breakOnNext,
  sourceContents,
  setBreakpoint,
  removeBreakpoint,
  setBreakpointCondition,
  evaluate,
  debuggeeCommand,
  navigate,
  reload,
  getProperties,
  pauseOnExceptions,
  prettyPrint,
  disablePrettyPrint,
  recordCoverage
};

module.exports = {
  setupCommands,
  clientCommands
};
