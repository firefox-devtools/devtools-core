// @flow

import type { Location } from "../types";
import type { ServerLocation } from "./types";

function fromServerLocation(serverLocation?: ServerLocation): ?Location {
  if (serverLocation) {
    return {
      sourceId: serverLocation.scriptId,
      line: serverLocation.lineNumber + 1,
      column: serverLocation.columnNumber
    };
  }
}

function toServerLocation(location: Location): ServerLocation {
  return {
    scriptId: location.sourceId,
    lineNumber: location.line - 1
  };
}

function createFrame(frame: any) {
  return {
    id: frame.callFrameId,
    displayName: frame.functionName,
    scopeChain: frame.scopeChain,
    location: fromServerLocation(frame.location)
  };
}

module.exports = {
  fromServerLocation,
  toServerLocation,
  createFrame
};
