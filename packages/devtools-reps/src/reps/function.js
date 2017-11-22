/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const PropTypes = require("prop-types");

// Reps
const {
  getGripType,
  isGrip,
  cropString,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
const Svg = require("../shared/images/Svg");

const dom = require("react-dom-factories");
const { span } = dom;

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
  if (onViewSourceInDebugger && grip.location && grip.location.url) {
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

  return (
    span({
      "data-link-actor-id": grip.actor,
      className: "objectBox objectBox-function",
      // Set dir="ltr" to prevent function parentheses from
      // appearing in the wrong direction
      dir: "ltr",
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
  const {
    mode
  } = props;

  if (mode === MODE.TINY && !grip.isGenerator && !grip.isAsync) {
    return null;
  }

  let title = mode === MODE.TINY
    ? ""
    : "function ";

  if (grip.isGenerator) {
    title = mode === MODE.TINY
      ? "* "
      : "function* ";
  }

  if (grip.isAsync) {
    title = "async" + " " + title;
  }

  return span({
    className: "objectTitle",
  }, title);
}

function getFunctionName(grip, props) {
  let name = grip.userDisplayName
    || grip.displayName
    || grip.name
    || props.functionName
    || "";
  return cropString(name, 100);
}

function renderParams(props) {
  const {
    parameterNames = []
  } = props;

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
    return (type == "function");
  }

  return (type == "Function");
}

// Exports from this module

module.exports = {
  rep: wrapRender(FunctionRep),
  supportsObject,
};
