/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");
// Utils
const {
  getGripType,
  isGrip,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders Error objects.
 */
ErrorRep.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
};

function ErrorRep(props) {
  let object = props.object;
  let preview = object.preview;
  let name = preview && preview.name
    ? preview.name
    : "Error";

  let content = props.mode === MODE.TINY
    ? name
    : `${name}: ${preview.message}`;

  if (preview.stack && props.mode !== MODE.TINY) {
    let formattedStack = formatTrace(parseStack(preview.stack));
    /*
      * Since Reps are used in the JSON Viewer, we can't localize
      * the "Stack trace" label (defined in debugger.properties as
      * "variablesViewErrorStacktrace" property), until Bug 1317038 lands.
      */
    content = `${content}\nStack trace:\n${formattedStack}`;
  }

  return span({
    "data-link-actor-id": object.actor,
    className: "objectBox-stackTrace"
  }, content);
}

/**
 * String utility to ensure that strings are a specified length. Strings
 * that are too long are truncated to the max length and the last char is
 * set to "_". Strings that are too short are padded with spaces.
 *
 * @param {string} str
 *        The string to format to the correct length
 * @param {number} maxLen
 *        The maximum allowed length of the returned string
 * @param {number} minLen (optional)
 *        The minimum allowed length of the returned string. If undefined,
 *        then maxLen will be used
 * @param {object} options (optional)
 *        An object allowing format customization. Allowed customizations:
 *          'truncate' - can take the value "start" to truncate strings from
 *             the start as opposed to the end or "center" to truncate
 *             strings in the center.
 *          'align' - takes an alignment when padding is needed for MinLen,
 *             either "start" or "end".  Defaults to "start".
 * @return {string}
 *        The original string formatted to fit the specified lengths
 */
function fmt(str, maxLen, minLen, options) {
  if (minLen == null) {
    minLen = maxLen;
  }
  if (str == null) {
    str = "";
  }
  if (str.length > maxLen) {
    if (options && options.truncate == "start") {
      return "_" + str.substring(str.length - maxLen + 1);
    } else if (options && options.truncate == "center") {
      let start = str.substring(0, (maxLen / 2));

      let end = str.substring((str.length - (maxLen / 2)) + 1);
      return start + "_" + end;
    }
    return str.substring(0, maxLen - 1) + "_";
  }
  if (str.length < minLen && options) {
    let padding = Array(minLen - str.length + 1).join(" ");
    str = (options.align === "end") ? padding + str : str + padding;
  }
  return str;
}

/**
 * Parse a stack trace, returning an array of stack frame objects, where
 * each has filename/lineNumber/functionName members
 *
 * @param {string} stack
 *        The serialized stack trace
 * @return {object[]}
 *        Array of { functionName: "...", lineNumber: NNN, ... } objects
 */
function parseStack(stack) {
  let trace = [];
  stack.split("\n").forEach((line) => {
    if (!line) {
      return;
    }

    const parsedStack = line.match(/(.*)?@(.*):(\d+):(\d+)/);

    trace.push({
      functionName: parsedStack[1],
      location: parsedStack[2],
      lineNumber: parsedStack[3],
      columnNumber: parsedStack[4]
    });
  });

  return trace;
}

/**
 * Take the output from parseStack() and convert it to nice readable
 * output
 *
 * @param {object[]} trace
 *        Array of trace objects as created by parseStack()
 * @return {string} Multi line report of the stack trace
 */
function formatTrace(trace) {
  let result = "";

  trace.forEach((line) => {
    result += (fmt(line.functionName, 75, 0, { truncate: "center" }) + " @ " +
               fmt(line.location, 20, 20, { truncate: "start" }) + " " +
               fmt(line.lineNumber, 5, 5) + " : " +
               fmt(line.columnNumber, 5, 5)).trim() + "\n";
  });

  return result;
}

// Registration
function supportsObject(object, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }
  return (object.preview && getGripType(object, noGrip) === "Error");
}

// Exports from this module
module.exports = {
  rep: wrapRender(ErrorRep),
  supportsObject,
};
