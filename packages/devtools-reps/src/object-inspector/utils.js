/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const get = require("lodash/get");
const { maybeEscapePropertyName } = require("../reps/rep-utils");

let WINDOW_PROPERTIES = {};

if (typeof window === "object") {
  WINDOW_PROPERTIES = Object.getOwnPropertyNames(window);
}

function getValue(item) {
  let value = get(item, "contents.value", undefined);

  if (!value && nodeHasAccessors(item)) {
    value = item.contents;
  }

  return value;
}

function isBucket(item) {
  return item.path && item.path.match(/bucket(\d+)$/);
}

function nodeHasChildren(item) {
  return Array.isArray(item.contents) || isBucket(item);
}

function nodeIsObject(item) {
  const value = getValue(item);
  return value && value.type === "object";
}

function nodeIsArray(value) {
  return value && value.class === "Array";
}

function nodeIsFunction(item) {
  const value = getValue(item);
  return value && value.class === "Function";
}

function nodeIsOptimizedOut(item) {
  const value = getValue(item);
  return !nodeHasChildren(item) && value && value.optimizedOut;
}

function nodeIsMissingArguments(item) {
  const value = getValue(item);
  return !nodeHasChildren(item) && value && value.missingArguments;
}

function nodeHasProperties(item) {
  return !nodeHasChildren(item) && nodeIsObject(item);
}

function nodeIsPrimitive(item) {
  return !nodeHasChildren(item)
    && !nodeHasProperties(item)
    && !nodeHasAccessors(item);
}

function isPromise(item) {
  const value = getValue(item);
  return value.class == "Promise";
}

function getPromiseProperties(item) {
  const { promiseState: { reason, value, state } } = getValue(item);

  const properties = [];

  if (state) {
    properties.push(
      createNode("<state>", `${item.path}/state`, { value: state })
    );
  }

  if (reason) {
    properties.push(
      createNode("<reason>", `${item.path}/reason`, { value: reason })
    );
  }

  if (value) {
    properties.push(
      createNode("<value>", `${item.path}/value`, { value: value })
    );
  }

  return properties;
}

function getNodeGetter(item) {
  return get(item, "contents.get", undefined);
}

function getNodeSetter(item) {
  return get(item, "contents.set", undefined);
}

function nodeHasAccessors(item) {
  return !!getNodeGetter(item) || !!getNodeSetter(item);
}

function getAccessors(item) {
  const accessors = [];

  const getter = getNodeGetter(item);
  if (getter && getter.type !== "undefined") {
    accessors.push(createNode("<get>", `${item.path}/get`, { value: getter }));
  }

  const setter = getNodeSetter(item);
  if (setter && setter.type !== "undefined") {
    accessors.push(createNode("<set>", `${item.path}/set`, { value: setter }));
  }

  return accessors;
}

function isDefault(item, roots) {
  if (roots && roots.length === 1) {
    const value = getValue(roots[0]);
    return value.class === "Window";
  }
  return WINDOW_PROPERTIES.includes(item.name);
}

function sortProperties(properties) {
  return properties.sort((a, b) => {
    // Sort numbers in ascending order and sort strings lexicographically
    const aInt = parseInt(a, 10);
    const bInt = parseInt(b, 10);

    if (isNaN(aInt) || isNaN(bInt)) {
      return a > b ? 1 : -1;
    }

    return aInt - bInt;
  });
}

function makeNumericalBuckets(props, bucketSize, parentPath, ownProperties) {
  const numProperties = props.length;
  const numBuckets = Math.ceil(numProperties / bucketSize);
  let buckets = [];
  for (let i = 1; i <= numBuckets; i++) {
    const bucketKey = `bucket${i}`;
    const minKey = (i - 1) * bucketSize;
    const maxKey = Math.min(i * bucketSize - 1, numProperties);
    const bucketName = `[${minKey}..${maxKey}]`;
    const bucketProperties = props.slice(minKey, maxKey);

    const bucketNodes = bucketProperties.map(name =>
      createNode(
        name,
        `${parentPath}/${bucketKey}/${name}`,
        ownProperties[name]
      )
    );

    buckets.push(
      createNode(bucketName, `${parentPath}/${bucketKey}`, bucketNodes)
    );
  }
  return buckets;
}

function makeDefaultPropsBucket(props, parentPath, ownProperties) {
  const userProps = props.filter(name => !isDefault({ name }));
  const defaultProps = props.filter(name => isDefault({ name }));

  let nodes = makeNodesForOwnProps(userProps, parentPath, ownProperties);

  if (defaultProps.length > 0) {
    const defaultNodes = defaultProps.map((name, index) =>
      createNode(
        maybeEscapePropertyName(name),
        `${parentPath}/bucket${index}/${name}`,
        ownProperties[name]
      )
    );
    nodes.push(
      createNode(
        "[default properties]",
        `${parentPath}/##-default`,
        defaultNodes
      )
    );
  }
  return nodes;
}

function makeNodesForOwnProps(properties, parentPath, ownProperties) {
  return properties.map(name =>
    createNode(
      maybeEscapePropertyName(name),
      `${parentPath}/${name}`,
      ownProperties[name]
    )
  );
}

/*
 * Ignore properties that are neither non-concrete nor getters/setters.
*/
function makeNodesForProperties(objProps, parent, { bucketSize = 100 } = {}) {
  const { ownProperties, prototype, ownSymbols } = objProps;
  const parentPath = parent.path;
  const parentValue = getValue(parent);
  const properties = sortProperties(Object.keys(ownProperties)).filter(name =>
    ownProperties[name].hasOwnProperty("value")
    || ownProperties[name].hasOwnProperty("get")
    || ownProperties[name].hasOwnProperty("set")
  );

  const numProperties = properties.length;

  let nodes = [];
  if (nodeIsArray(prototype) && numProperties > bucketSize) {
    nodes = makeNumericalBuckets(
      properties,
      bucketSize,
      parentPath,
      ownProperties
    );
  } else if (parentValue.class == "Window") {
    nodes = makeDefaultPropsBucket(properties, parentPath, ownProperties);
  } else {
    nodes = makeNodesForOwnProps(properties, parentPath, ownProperties);
  }

  for (let index in ownSymbols) {
    nodes.push(
      createNode(
        ownSymbols[index].name,
        `${parentPath}/##symbol-${index}`,
        ownSymbols[index].descriptor
      )
    );
  }

  if (isPromise(parent)) {
    nodes.push(...getPromiseProperties(parent));
  }

  // Add the prototype if it exists and is not null
  if (prototype && prototype.type !== "null") {
    nodes.push(
      createNode("__proto__", `${parentPath}/__proto__`, { value: prototype })
    );
  }

  return nodes;
}

function createNode(name, path, contents) {
  if (contents === undefined) {
    return null;
  }
  // The path is important to uniquely identify the item in the entire
  // tree. This helps debugging & optimizes React's rendering of large
  // lists. The path will be separated by property name,
  // i.e. `{ foo: { bar: { baz: 5 }}}` will have a path of `foo/bar/baz`
  // for the inner object.
  return { name, path, contents };
}

function getChildren({ getObjectProperties, actors, item }) {
  // Nodes can either have children already, or be an object with
  // properties that we need to go and fetch.

  if (nodeHasAccessors(item)) {
    return getAccessors(item);
  }

  if (nodeHasChildren(item)) {
    return item.contents;
  }

  if (!nodeHasProperties(item)) {
    return [];
  }

  // Because we are dynamically creating the tree as the user
  // expands it (not precalculated tree structure), we cache child
  // arrays. This not only helps performance, but is necessary
  // because the expanded state depends on instances of nodes
  // being the same across renders. If we didn't do this, each
  // node would be a new instance every render.
  const key = item.path;
  if (actors && actors[key]) {
    return actors[key];
  }

  if (isBucket(item)) {
    return item.contents.children;
  }

  const actor = get(item, "contents.value.actor", undefined);
  const loadedProps = getObjectProperties(actor);
  const { ownProperties, prototype } = loadedProps || {};

  if (!ownProperties && !prototype) {
    return [];
  }

  let children = makeNodesForProperties(loadedProps, item);
  actors[key] = children;
  return children;
}

module.exports = {
  createNode,
  getChildren,
  getPromiseProperties,
  getValue,
  isDefault,
  isPromise,
  makeNodesForProperties,
  nodeHasAccessors,
  nodeHasChildren,
  nodeHasProperties,
  nodeIsFunction,
  nodeIsMissingArguments,
  nodeIsObject,
  nodeIsOptimizedOut,
  nodeIsPrimitive,
  sortProperties,
};
