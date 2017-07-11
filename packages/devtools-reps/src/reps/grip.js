/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const React = require("react");
// Dependencies
const {
  isGrip,
  wrapRender,
} = require("./rep-utils");
const Caption = require("./caption");
const PropRep = require("./prop-rep");
const { MODE } = require("./constants");
// Shortcuts
const { span } = React.DOM;

/**
 * Renders generic grip. Grip is client representation
 * of remote JS object and is used as an input object
 * for this rep component.
 */
GripRep.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  isInterestingProp: React.PropTypes.func,
  title: React.PropTypes.string,
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
  noGrip: React.PropTypes.bool,
};

function GripRep(props) {
  let {
    mode = MODE.SHORT,
    object,
  } = props;

  const config = {
    "data-link-actor-id": object.actor,
    className: "objectBox objectBox-object"
  };

  if (mode === MODE.TINY) {
    return (
      span(config, getTitle(props, object))
    );
  }

  let propsArray = safePropIterator(props, object, maxLengthMap.get(mode));

  return (
    span(config,
      getTitle(props, object),
      span({
        className: "objectLeftBrace",
      }, " { "),
      ...propsArray,
      span({
        className: "objectRightBrace",
      }, " }")
    )
  );
}

function getTitle(props, object) {
  let title = props.title || object.class || "Object";
  return span({}, title);
}

function safePropIterator(props, object, max) {
  max = (typeof max === "undefined") ? maxLengthMap.get(MODE.SHORT) : max;
  try {
    return propIterator(props, object, max);
  } catch (err) {
    console.error(err);
  }
  return [];
}

function propIterator(props, object, max) {
  if (object.preview && Object.keys(object.preview).includes("wrappedValue")) {
    const { Rep } = require("./rep");

    return [Rep({
      object: object.preview.wrappedValue,
      mode: props.mode || MODE.TINY,
      defaultRep: Grip,
    })];
  }

  // Property filter. Show only interesting properties to the user.
  let isInterestingProp = props.isInterestingProp || ((type, value) => {
    return (
      type == "boolean" ||
      type == "number" ||
      (type == "string" && value.length != 0)
    );
  });

  let properties = object.preview
    ? object.preview.ownProperties
    : {};
  let propertiesLength = object.preview && object.preview.ownPropertiesLength
    ? object.preview.ownPropertiesLength
    : object.ownPropertyLength;

  if (object.preview && object.preview.safeGetterValues) {
    properties = Object.assign({}, properties, object.preview.safeGetterValues);
    propertiesLength += Object.keys(object.preview.safeGetterValues).length;
  }

  let indexes = getPropIndexes(properties, max, isInterestingProp);
  if (indexes.length < max && indexes.length < propertiesLength) {
    // There are not enough props yet. Then add uninteresting props to display them.
    indexes = indexes.concat(
      getPropIndexes(properties, max - indexes.length, (t, value, name) => {
        return !isInterestingProp(t, value, name);
      })
    );
  }

  // The server synthesizes some property names for a Proxy, like
  // <target> and <handler>; we don't want to quote these because,
  // as synthetic properties, they appear more natural when
  // unquoted.
  const suppressQuotes = object.class === "Proxy";
  let propsArray = getProps(props, properties, indexes, suppressQuotes);
  if (Object.keys(properties).length > max || propertiesLength > max) {
    // There are some undisplayed props. Then display "more...".
    propsArray.push(Caption({
      object: span({}, "more…")
    }));
  }

  return unfoldProps(propsArray);
}

function unfoldProps(items) {
  return items.reduce((res, item, index) => {
    if (Array.isArray(item)) {
      res = res.concat(item);
    } else {
      res.push(item);
    }

    // Interleave commas between elements
    if (index !== items.length - 1) {
      res.push(", ");
    }
    return res;
  }, []);
}

/**
 * Get props ordered by index.
 *
 * @param {Object} componentProps Grip Component props.
 * @param {Object} properties Properties of the object the Grip describes.
 * @param {Array} indexes Indexes of properties.
 * @param {Boolean} suppressQuotes true if we should suppress quotes
 *                  on property names.
 * @return {Array} Props.
 */
function getProps(componentProps, properties, indexes, suppressQuotes) {
  // Make indexes ordered by ascending.
  indexes.sort(function (a, b) {
    return a - b;
  });

  const propertiesKeys = Object.keys(properties);
  return indexes.map((i) => {
    let name = propertiesKeys[i];
    let value = getPropValue(properties[name]);

    return PropRep(Object.assign({}, componentProps, {
      mode: MODE.TINY,
      name,
      object: value,
      equal: ": ",
      defaultRep: Grip,
      title: null,
      suppressQuotes,
    }));
  });
}

/**
 * Get the indexes of props in the object.
 *
 * @param {Object} properties Props object.
 * @param {Number} max The maximum length of indexes array.
 * @param {Function} filter Filter the props you want.
 * @return {Array} Indexes of interesting props in the object.
 */
function getPropIndexes(properties, max, filter) {
  let indexes = [];

  try {
    let i = 0;
    for (let name in properties) {
      if (indexes.length >= max) {
        return indexes;
      }

      // Type is specified in grip's "class" field and for primitive
      // values use typeof.
      let value = getPropValue(properties[name]);
      let type = (value.class || typeof value);
      type = type.toLowerCase();

      if (filter(type, value, name)) {
        indexes.push(i);
      }
      i++;
    }
  } catch (err) {
    console.error(err);
  }
  return indexes;
}

/**
 * Get the actual value of a property.
 *
 * @param {Object} property
 * @return {Object} Value of the property.
 */
function getPropValue(property) {
  let value = property;
  if (typeof property === "object") {
    let keys = Object.keys(property);
    if (keys.includes("value")) {
      value = property.value;
    } else if (keys.includes("getterValue")) {
      value = property.getterValue;
    }
  }
  return value;
}

// Registration
function supportsObject(object, type, noGrip = false) {
  if (noGrip === true || !isGrip(object)) {
    return false;
  }
  return (object.preview && object.preview.ownProperties);
}

const maxLengthMap = new Map();
maxLengthMap.set(MODE.SHORT, 3);
maxLengthMap.set(MODE.LONG, 10);

// Grip is used in propIterator and has to be defined here.
let Grip = {
  rep: wrapRender(GripRep),
  supportsObject,
  maxLengthMap,
};

// Exports from this module
module.exports = Grip;
