/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const PropTypes = require("prop-types");

// Reps
const { getGripType, isGrip, cropString, wrapRender } = require("./rep-utils");
const { MODE } = require("./constants");
const Svg = require("../shared/images/Svg");

const dom = require("react-dom-factories");
const { span } = dom;

const IGNORED_SOURCE_URLS = ["debugger eval code"];

/**
 * This component represents a template for Function objects.
 */
FunctionRep.propTypes = {
  object: PropTypes.object.isRequired,
  parameterNames: PropTypes.array,
  onViewSourceInDebugger: PropTypes.func,
};

function FunctionRep(props) {
  let {
    object: grip,
    onViewSourceInDebugger,
  } = props;

  let jumpToDefinitionButton;
  if (onViewSourceInDebugger &&
    grip.location &&
    grip.location.url &&
    !IGNORED_SOURCE_URLS.includes(grip.location.url)
  ) {
    jumpToDefinitionButton = Svg("jump-definition", {
      element: "a",
      draggable: false,
      title: "Jump to definition",
      onClick: e => {
        // Stop the event propagation so we don't trigger ObjectInspector expand/collapse.
        e.stopPropagation();
        onViewSourceInDebugger(grip.location);
      }
    });
  }

  return span(
    {
      "data-link-actor-id": grip.actor,
      className: "objectBox objectBox-function",
      // Set dir="ltr" to prevent function parentheses from
      // appearing in the wrong direction
      dir: "ltr"
    },
      getTitle(grip, props),
      getFunctionName(grip, props),
      "(",
      ...renderParams(props),
      ")",
      jumpToDefinitionButton,
    )
  );
}

function getTitle(grip, props) {
  const { mode } = props;

  if (mode === MODE.TINY && !grip.isGenerator && !grip.isAsync) {
    return null;
  }

  let title = mode === MODE.TINY ? "" : "function ";

  if (grip.isGenerator) {
    title = mode === MODE.TINY ? "* " : "function* ";
  }

  if (grip.isAsync) {
    title = "async" + " " + title;
  }

  return span(
    {
      className: "objectTitle"
    },
    title
  );
}

// Decodes an anonymous naming scheme that
// spider monkey implements based on "Naming Anonymous JavaScript Functions"
// http://johnjbarton.github.io/nonymous/index.html
const objectProperty = /([\w\d]+)$/;
const arrayProperty = /\[(.*?)\]$/;
const functionProperty = /([\w\d]+)[\/\.<]*?$/;
const annonymousProperty = /([\w\d]+)\(\^\)$/;

function getFunctionName(grip, props) {
  const scenarios = [
    objectProperty,
    arrayProperty,
    functionProperty,
    annonymousProperty
  ];

  scenarios.some(reg => {
    const match = reg.exec(name);
    if (match) {
      name = match[1];
      return true;
    }
    return false;
  });

  let { functionName } = props;
  let end = functionName.length - 1;
  let name;

  functionName =
    functionName.startsWith('"') && functionName.endsWith('"')
      ? functionName.substring(1, end)
      : functionName;

  if (
    grip.displayName != undefined &&
    functionName != undefined &&
    grip.displayName != functionName
  ) {
    name = functionName + ": " + grip.displayName;
  } else {
    name =
      grip.userDisplayName ||
      grip.displayName ||
      grip.name ||
      props.functionName ||
      "";
  }

  return cropString(name, 100);
}

function renderParams(props) {
  const { parameterNames = [] } = props;

  return parameterNames
    .filter(param => param)
    .reduce((res, param, index, arr) => {
      res.push(span({ className: "param" }, param));
      if (index < arr.length - 1) {
        res.push(span({ className: "delimiter" }, ", "));
      }
      return res;
    }, []);
}

// Registration
function supportsObject(grip, noGrip = false) {
  const type = getGripType(grip, noGrip);
  if (noGrip === true || !isGrip(grip)) {
    return type == "function";
  }

  return type == "Function";
}

// Exports from this module

module.exports = {
  rep: wrapRender(FunctionRep),
  supportsObject,
  // exported for testing purpose.
  getFunctionName,
};
