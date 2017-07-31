/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 // @flow
const get = require("lodash/get");
const has = require("lodash/has");
const { maybeEscapePropertyName } = require("../reps/rep-utils");

const NODE_TYPES = {
  BUCKET: Symbol("[n…m]"),
  DEFAULT_PROPERTIES: Symbol("[default properties]"),
  GET: Symbol("<get>"),
  GRIP: Symbol("GRIP"),
  PROMISE_REASON: Symbol("<reason>"),
  PROMISE_STATE: Symbol("<state>"),
  PROMISE_VALUE: Symbol("<value>"),
  SET: Symbol("<set>"),
};

import type {
  ObjectInspectorItemContentsValue,
  ObjectInspectorItemContents,
  ObjectInspectorItem,
} from "./types";

type LoadedProperties = {
  ownProperties?: Object,
  ownSymbols?: Array<Object>,
  safeGetterValues?: Object,
  prototype?: Object
};

let WINDOW_PROPERTIES = {};

if (typeof window === "object") {
  WINDOW_PROPERTIES = Object.getOwnPropertyNames(window);
}

const SAFE_PATH_PREFIX = "##-";

function getType(item: ObjectInspectorItem): Symbol {
  return item.type;
}

function getValue(
  item: ObjectInspectorItem
) : ObjectInspectorItemContentsValue | ObjectInspectorItemContents {
  if (has(item, "contents.value")) {
    return get(item, "contents.value");
  }

  if (has(item, "contents.getterValue")) {
    return get(item, "contents.getterValue", undefined);
  }

  if (nodeHasAccessors(item)) {
    return item.contents;
  }

  return undefined;
}

function nodeIsBucket(item: ObjectInspectorItem) : boolean {
  return getType(item) === NODE_TYPES.BUCKET;
}

function nodeHasChildren(item: ObjectInspectorItem) : boolean {
  return Array.isArray(item.contents)
    || nodeIsBucket(item);
}

function nodeIsObject(item: ObjectInspectorItem) : boolean {
  const value = getValue(item);
  return value && value.type === "object";
}

function nodeIsArray(item: ObjectInspectorItem) : boolean {
  const value = getValue(item);
  return (value && value.class === "Array");
}

function nodeIsFunction(item: ObjectInspectorItem) : boolean {
  const value = getValue(item);
  return value && value.class === "Function";
}

function nodeIsOptimizedOut(item: ObjectInspectorItem) : boolean {
  const value = getValue(item);
  return !nodeHasChildren(item) && value && value.optimizedOut;
}

function nodeIsMissingArguments(item: ObjectInspectorItem) : boolean {
  const value = getValue(item);
  return !nodeHasChildren(item) && value && value.missingArguments;
}

function nodeHasProperties(item: ObjectInspectorItem) : boolean {
  return !nodeHasChildren(item) && nodeIsObject(item);
}

function nodeIsPrimitive(item: ObjectInspectorItem) : boolean {
  return !nodeHasChildren(item)
    && !nodeHasProperties(item)
    && !nodeHasAccessors(item);
}

function nodeIsDefault(
  item: ObjectInspectorItem,
  roots: Array<ObjectInspectorItem>
) : boolean {
  if (roots && roots.length === 1) {
    const value = getValue(roots[0]);
    return value.class === "Window";
  }
  return WINDOW_PROPERTIES.includes(item.name);
}

function isDefaultWindowProperty(name:string) : boolean {
  return WINDOW_PROPERTIES.includes(name);
}

function nodeIsPromise(item: ObjectInspectorItem) : boolean {
  const value = getValue(item);
  if (!value) {
    return false;
  }

  return value.class == "Promise";
}

function nodeHasAccessors(item: ObjectInspectorItem) : boolean {
  return !!getNodeGetter(item) || !!getNodeSetter(item);
}

function nodeSupportsBucketing(item: ObjectInspectorItem) : boolean {
  return nodeIsArray(item);
}

function makeNodesForPromiseProperties(
  item: ObjectInspectorItem
) : Array<ObjectInspectorItem> {
  const { promiseState: { reason, value, state } } = getValue(item);

  const properties = [];

  if (state) {
    properties.push(
      createNode(
        item,
        "<state>",
        `${item.path}/${SAFE_PATH_PREFIX}state`,
        { value: state },
        NODE_TYPES.PROMISE_STATE
      )
    );
  }

  if (reason) {
    properties.push(
      createNode(
        item,
        "<reason>",
        `${item.path}/${SAFE_PATH_PREFIX}reason`,
        { value: reason },
        NODE_TYPES.PROMISE_REASON
      )
    );
  }

  if (value) {
    properties.push(
      createNode(
        item,
        "<value>",
        `${item.path}/${SAFE_PATH_PREFIX}value`,
        { value: value },
        NODE_TYPES.PROMISE_VALUE
      )
    );
  }

  return properties;
}

function getNodeGetter(item: ObjectInspectorItem): ?Object {
  return get(item, "contents.get", undefined);
}

function getNodeSetter(item: ObjectInspectorItem): ?Object {
  return get(item, "contents.set", undefined);
}

function makeNodesForAccessors(item: ObjectInspectorItem) : Array<ObjectInspectorItem> {
  const accessors = [];

  const getter = getNodeGetter(item);
  if (getter && getter.type !== "undefined") {
    accessors.push(createNode(
      item,
      "<get>",
      `${item.path}/${SAFE_PATH_PREFIX}get`,
      { value: getter },
      NODE_TYPES.GET
    ));
  }

  const setter = getNodeSetter(item);
  if (setter && setter.type !== "undefined") {
    accessors.push(createNode(
      item,
      "<set>",
      `${item.path}/${SAFE_PATH_PREFIX}set`,
      { value: setter },
      NODE_TYPES.SET
    ));
  }

  return accessors;
}

function sortProperties(properties: Array<any>) : Array<any> {
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

function makeNumericalBuckets(
  propertiesNames: Array<string>,
  bucketSize: number,
  parent: ObjectInspectorItem,
  ownProperties: Object
) : Array<ObjectInspectorItem> {
  const parentPath = parent.path;
  const numProperties = propertiesNames.length;
  const numBuckets = Math.ceil(numProperties / bucketSize);
  let buckets = [];
  for (let i = 1; i <= numBuckets; i++) {
    const bucketKey = `${SAFE_PATH_PREFIX}bucket${i}`;
    const minKey = (i - 1) * bucketSize;
    const maxKey = Math.min(i * bucketSize - 1, numProperties);
    const bucketName = `[${minKey}..${maxKey}]`;
    const bucketProperties = propertiesNames.slice(minKey, maxKey);

    const bucketNodes = bucketProperties.map(name =>
      createNode(
        parent,
        name,
        `${parentPath}/${bucketKey}/${name}`,
        ownProperties[name]
      )
    );

    buckets.push(
      createNode(
        parent,
        bucketName,
        `${parentPath}/${bucketKey}`,
        bucketNodes,
        NODE_TYPES.BUCKET
      )
    );
  }
  return buckets;
}

function makeDefaultPropsBucket(
  propertiesNames: Array<string>,
  parent: ObjectInspectorItem,
  ownProperties: Object
) : Array<ObjectInspectorItem> {
  const parentPath = parent.path;

  const [
    userPropertiesNames,
    defaultProperties
  ] = propertiesNames.reduce((res, name) => {
    const [userProps, defaultProps] = res;
    (isDefaultWindowProperty(name) ? defaultProps : userProps).push(name);
    return res;
  }, [[], []]);

  let nodes = makeNodesForOwnProps(userPropertiesNames, parent, ownProperties);

  if (defaultProperties.length > 0) {
    const defaultPropertiesNode = createNode(
      parent,
      "[default properties]",
      `${parentPath}/${SAFE_PATH_PREFIX}default`,
      null,
      NODE_TYPES.DEFAULT_PROPERTIES
    );

    const defaultNodes = defaultProperties.map((name, index) =>
      createNode(
        defaultPropertiesNode,
        maybeEscapePropertyName(name),
        `${parentPath}/${SAFE_PATH_PREFIX}bucket${index}/${name}`,
        ownProperties[name]
      )
    );
    nodes.push(
      setNodeChildren(defaultPropertiesNode, defaultNodes)
    );
  }
  return nodes;
}

function makeNodesForOwnProps(
  propertiesNames: Array<string>,
  parent: ObjectInspectorItem,
  ownProperties: Object
) : Array<ObjectInspectorItem> {
  const parentPath = parent.path;
  return propertiesNames.map(name =>
    createNode(
      parent,
      maybeEscapePropertyName(name),
      `${parentPath}/${name}`,
      ownProperties[name]
    )
  );
}

function makeNodesForProperties(
  objProps: LoadedProperties,
  parent: ObjectInspectorItem,
  {
    bucketSize = 100
  } : Object = {}
) : Array<ObjectInspectorItem> {
  const {
    ownProperties = {},
    ownSymbols,
    prototype,
    safeGetterValues,
  } = objProps;

  const parentPath = parent.path;
  const parentValue = getValue(parent);

  let allProperties = Object.assign({}, ownProperties, safeGetterValues);

  // Ignore properties that are neither non-concrete nor getters/setters.
  const propertiesNames = sortProperties(Object.keys(allProperties)).filter(name =>
    allProperties[name].hasOwnProperty("value")
    || allProperties[name].hasOwnProperty("getterValue")
    || allProperties[name].hasOwnProperty("get")
    || allProperties[name].hasOwnProperty("set")
  );

  const numProperties = propertiesNames.length;

  let nodes = [];
  if (nodeSupportsBucketing(parent) && numProperties > bucketSize) {
    nodes = makeNumericalBuckets(
      propertiesNames,
      bucketSize,
      parent,
      allProperties
    );
  } else if (parentValue && parentValue.class == "Window") {
    nodes = makeDefaultPropsBucket(propertiesNames, parent, allProperties);
  } else {
    nodes = makeNodesForOwnProps(propertiesNames, parent, allProperties);
  }

  if (Array.isArray(ownSymbols)) {
    ownSymbols.forEach((ownSymbol, index) => {
      nodes.push(
        createNode(
          parent,
          ownSymbol.name,
          `${parentPath}/${SAFE_PATH_PREFIX}symbol-${index}`,
          ownSymbol.descriptor
        )
      );
    }, this);
  }

  if (nodeIsPromise(parent)) {
    nodes.push(...makeNodesForPromiseProperties(parent));
  }

  // Add the prototype if it exists and is not null
  if (prototype && prototype.type !== "null") {
    nodes.push(
      createNode(parent, "__proto__", `${parentPath}/__proto__`, { value: prototype })
    );
  }

  return nodes;
}

function createNode(
  parent: ObjectInspectorItem,
  name: string,
  path: string,
  contents: any,
  type: ?Symbol = NODE_TYPES.GRIP
) : ?ObjectInspectorItem {
  if (contents === undefined) {
    return null;
  }

  // The path is important to uniquely identify the item in the entire
  // tree. This helps debugging & optimizes React's rendering of large
  // lists. The path will be separated by property name,
  // i.e. `{ foo: { bar: { baz: 5 }}}` will have a path of `foo/bar/baz`
  // for the inner object.
  return {
    parent,
    name,
    path,
    contents,
    type,
  };
}

function setNodeChildren(
  node: ObjectInspectorItem,
  children: Array<ObjectInspectorItem>
) : ObjectInspectorItem {
  node.contents = children;
  return node;
}

function getChildren(options: {
  actors: Object,
  getObjectProperties: (ObjectInspectorItemContentsValue) => LoadedProperties,
  item: ObjectInspectorItem
}) : Array<ObjectInspectorItem> {
  const {
    actors = {},
    getObjectProperties,
    item
  } = options;
  // Nodes can either have children already, or be an object with
  // properties that we need to go and fetch.
  if (nodeHasAccessors(item)) {
    return makeNodesForAccessors(item);
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

  if (nodeIsBucket(item)) {
    return item.contents.children;
  }

  let loadedProps = getObjectProperties(
    get(getValue(item), "actor", undefined)
  );

  const {
    ownProperties,
    ownSymbols,
    safeGetterValues,
    prototype
  } = loadedProps || {};

  if (!ownProperties && !ownSymbols && !safeGetterValues && !prototype) {
    return [];
  }

  let children = makeNodesForProperties(loadedProps, item);
  actors[key] = children;
  return children;
}

function getParent(item: ObjectInspectorItem) : ObjectInspectorItem | null {
  return item.parent;
}

module.exports = {
  createNode,
  getChildren,
  getParent,
  getValue,
  makeNodesForPromiseProperties,
  makeNodesForProperties,
  nodeHasAccessors,
  nodeHasChildren,
  nodeHasProperties,
  nodeIsDefault,
  nodeIsFunction,
  nodeIsMissingArguments,
  nodeIsObject,
  nodeIsOptimizedOut,
  nodeIsPrimitive,
  nodeIsPromise,
  nodeSupportsBucketing,
  sortProperties,
  NODE_TYPES,
  // Export for testing purpose.
  SAFE_PATH_PREFIX,
};
