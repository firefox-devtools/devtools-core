/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  cropString,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * This component represents a template for Function objects.
 */
FunctionRep.propTypes = {
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
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
      summarizeFunction(grip),
      "(",
      ...renderParams(props),
      ")",
    )
  );
}

function getTitle(props, grip) {
  let title = "function ";
  if (grip.isGenerator) {
    title = "function* ";
  }
  if (grip.isAsync) {
    title = "async " + title;
  }

  return safeObjectLink(props, {}, title);
}

function summarizeFunction(grip) {
  let name = grip.userDisplayName || grip.displayName || grip.name || "";
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
function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return (type == "function");
  }

  return (type == "Function");
}

// Exports from this module

module.exports = {
  rep: wrapRender(FunctionRep),
  supportsObject,
};
