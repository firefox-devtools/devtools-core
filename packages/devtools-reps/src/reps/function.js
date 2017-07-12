/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  getGripType,
  isGrip,
  cropString,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * This component represents a template for Function objects.
 */
FunctionRep.propTypes = {
  object: React.PropTypes.object.isRequired,
  parameterNames: React.PropTypes.array,
};

function FunctionRep(props) {
  let grip = props.object;

  return (
    span({
      "data-link-actor-id": grip.actor,
      className: "objectBox objectBox-function",
      // Set dir="ltr" to prevent function parentheses from
      // appearing in the wrong direction
      dir: "ltr",
    },
      getTitle(props, grip),
      getFunctionName(grip, props),
      "(",
      ...renderParams(props),
      ")"
    )
  );
}

function getTitle(props, grip) {
  const {
    simplified
  } = props;

  if (simplified === true && !grip.isGenerator && !grip.isAsync) {
    return null;
  }

  let title = simplified === true
    ? ""
    : "function ";

  if (grip.isGenerator) {
    title = simplified === true
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
