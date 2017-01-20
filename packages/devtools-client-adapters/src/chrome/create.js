// @flow

import type { Location } from "../types";
import type { ServerLocation } from "./types";

function fromServerLocation(
  serverLocation: ServerLocation,
  location: Location
): Location {
  if (serverLocation) {
    return {
      sourceId: serverLocation.scriptId,
      line: serverLocation.lineNumber + 1,
      column: serverLocation.columnNumber
    };
  }

  return location;
}

function toServerLocation(location: Location): ServerLocation {
  return {
    scriptId: location.sourceId,
    lineNumber: location.line - 1
  };
}

module.exports = {
  fromServerLocation,
  toServerLocation
};
