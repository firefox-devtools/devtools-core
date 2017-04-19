// Dependencies
const React = require("react");
const {
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const Caption = require("./caption");
const PropRep = require("./prop-rep");
const { MODE } = require("./constants");
// Shortcuts
const { span } = React.DOM;
/**
 * Renders an object. An object is represented by a list of its
 * properties enclosed in curly brackets.
 */
ObjectRep.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  objectLink: React.PropTypes.func,
  title: React.PropTypes.string,
};

function ObjectRep(props) {
  let object = props.object;
  let propsArray = safePropIterator(props, object);

  if (props.mode === MODE.TINY || !propsArray.length) {
    return (
      span({className: "objectBox objectBox-object"},
        getTitle(props, object)
      )
    );
  }

  return (
    span({className: "objectBox objectBox-object"},
      getTitle(props, object),
      safeObjectLink(props, {
        className: "objectLeftBrace",
      }, " { "),
      ...propsArray,
      safeObjectLink(props, {
        className: "objectRightBrace",
      }, " }")
    )
  );
}

function getTitle(props, object) {
  let title = props.title || object.class || "Object";
  return safeObjectLink(props, {className: "objectTitle"}, title);
}

function safePropIterator(props, object, max) {
  max = (typeof max === "undefined") ? 3 : max;
  try {
    return propIterator(props, object, max);
  } catch (err) {
    console.error(err);
  }
  return [];
}

function propIterator(props, object, max) {
  let isInterestingProp = (type, value) => {
    // Do not pick objects, it could cause recursion.
    return (type == "boolean" || type == "number" || (type == "string" && value));
  };

  // Work around https://bugzilla.mozilla.org/show_bug.cgi?id=945377
  if (Object.prototype.toString.call(object) === "[object Generator]") {
    object = Object.getPrototypeOf(object);
  }

  // Object members with non-empty values are preferred since it gives the
  // user a better overview of the object.
  let interestingObject = getFilteredObject(object, max, isInterestingProp);

  if (Object.keys(interestingObject).length < max) {
    // There are not enough props yet (or at least, not enough props to
    // be able to know whether we should print "more…" or not).
    // Let's display also empty members and functions.
    interestingObject = Object.assign({}, interestingObject,
      getFilteredObject(
        object,
        max - Object.keys(interestingObject).length,
        (type, value) => !isInterestingProp(type, value)
      )
    );
  }

  const truncated = Object.keys(object).length > max;
  let propsArray = getPropsArray(interestingObject, truncated);
  if (truncated) {
    propsArray.push(Caption({
      object: safeObjectLink(props, {},
        (Object.keys(object).length - max) + " more…")
    }));
  }

  return propsArray;
}

/**
 * Get an array of components representing the properties of the object
 *
 * @param {Object} object
 * @param {Boolean} truncated true if the object is truncated.
 * @return {Array} Array of PropRep.
 */
function getPropsArray(object, truncated) {
  let propsArray = [];

  if (!object) {
    return propsArray;
  }

  // Hardcode tiny mode to avoid recursive handling.
  let mode = MODE.TINY;
  const objectKeys = Object.keys(object);
  return objectKeys.map((name, i) => PropRep({
    mode,
    name,
    object: object[name],
    equal: ": ",
    delim: i !== objectKeys.length - 1 || truncated ? ", " : null,
  }));
}

/**
 * Get a copy of the object filtered by a given predicate.
 *
 * @param {Object} object.
 * @param {Number} max The maximum length of keys array.
 * @param {Function} filter Filter the props you want.
 * @return {Object} the filtered object.
 */
function getFilteredObject(object, max, filter) {
  let filteredObject = {};

  try {
    for (let name in object) {
      if (Object.keys(filteredObject).length >= max) {
        return filteredObject;
      }

      let value;
      try {
        value = object[name];
      } catch (exc) {
        continue;
      }

      let t = typeof value;
      if (filter(t, value)) {
        filteredObject[name] = value;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return filteredObject;
}

function supportsObject(object, type) {
  return true;
}

// Exports from this module
module.exports = {
  rep: wrapRender(ObjectRep),
  supportsObject,
};
