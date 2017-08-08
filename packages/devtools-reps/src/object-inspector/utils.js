/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 // @flow
const get = require("lodash/get");
const has = require("lodash/has");
const { maybeEscapePropertyName } = require("../reps/rep-utils");
const ArrayRep = require("../reps/array");
const GripArrayRep = require("../reps/grip-array");
const GripMapEntryRep = require("../reps/grip-map-entry");

const NODE_TYPES = {
  BUCKET: Symbol("[n…n]"),
  DEFAULT_PROPERTIES: Symbol("[default properties]"),
  ENTRIES: Symbol("<entries>"),
  GET: Symbol("<get>"),
  GRIP: Symbol("GRIP"),
  MAP_ENTRY_KEY: Symbol("<key>"),
  MAP_ENTRY_VALUE: Symbol("<value>"),
  PROMISE_REASON: Symbol("<reason>"),
  PROMISE_STATE: Symbol("<state>"),
  PROMISE_VALUE: Symbol("<value>"),
  SET: Symbol("<set>"),
  PROTOTYPE: Symbol("__proto__"),
};

import type {
  LoadedEntries,
  LoadedProperties,
  Node,
  NodeContents,
  RdpGrip,
} from "./types";

let WINDOW_PROPERTIES = {};

if (typeof window === "object") {
  WINDOW_PROPERTIES = Object.getOwnPropertyNames(window);
}

const SAFE_PATH_PREFIX = "##-";

function getType(item: Node) : Symbol {
  return item.type;
}

function getValue(
  item: Node
) : RdpGrip | NodeContents {
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

function nodeIsBucket(item: Node) : boolean {
  return getType(item) === NODE_TYPES.BUCKET;
}

function nodeIsEntries(item: Node) : boolean {
  return getType(item) === NODE_TYPES.ENTRIES;
}

function nodeIsMapEntry(item: Node) : boolean {
  return GripMapEntryRep.supportsObject(getValue(item));
}

function nodeHasChildren(item: Node) : boolean {
  return Array.isArray(item.contents)
    || nodeIsBucket(item);
}

function nodeIsObject(item: Node) : boolean {
  const value = getValue(item);
  return value && value.type === "object";
}

function nodeIsArrayLike(item: Node) : boolean {
  const value = getValue(item);
  return GripArrayRep.supportsObject(value)
    || ArrayRep.supportsObject(value);
}

function nodeIsFunction(item: Node) : boolean {
  const value = getValue(item);
  return value && value.class === "Function";
}

function nodeIsOptimizedOut(item: Node) : boolean {
  const value = getValue(item);
  return !nodeHasChildren(item) && value && value.optimizedOut;
}

function nodeIsMissingArguments(item: Node) : boolean {
  const value = getValue(item);
  return !nodeHasChildren(item) && value && value.missingArguments;
}

function nodeHasProperties(item: Node) : boolean {
  return !nodeHasChildren(item) && nodeIsObject(item);
}

function nodeIsPrimitive(item: Node) : boolean {
  return !nodeHasChildren(item)
    && !nodeHasProperties(item)
    && !nodeIsEntries(item)
    && !nodeIsMapEntry(item)
    && !nodeHasAccessors(item);
}

function nodeIsDefaultProperties(
  item: Node
) : boolean {
  return getType(item) === NODE_TYPES.DEFAULT_PROPERTIES;
}

function isDefaultWindowProperty(name:string) : boolean {
  return WINDOW_PROPERTIES.includes(name);
}

function nodeIsPromise(item: Node) : boolean {
  const value = getValue(item);
  if (!value) {
    return false;
  }

  return value.class == "Promise";
}

function nodeIsPrototype(
  item: Node
) : boolean {
  return getType(item) === NODE_TYPES.PROTOTYPE;
}

function nodeIsWindow(
  item: Node
) : boolean {
  const value = getValue(item);
  if (!value) {
    return false;
  }

  return value.class == "Window";
}

function nodeIsGetter(
  item: Node
) : boolean {
  return getType(item) === NODE_TYPES.GET;
}

function nodeIsSetter(
  item: Node
) : boolean {
  return getType(item) === NODE_TYPES.SET;
}

function nodeHasAccessors(item: Node) : boolean {
  return !!getNodeGetter(item) || !!getNodeSetter(item);
}

function nodeSupportsBucketing(item: Node) : boolean {
  return nodeIsArrayLike(item)
    || nodeIsEntries(item);
}

function nodeHasEntries(
  item : Node
) : boolean {
  const value = getValue(item);
  if (!value) {
    return false;
  }

  return value.class === "Map"
    || value.class === "Set"
    || value.class === "WeakMap"
    || value.class === "WeakSet";
}

function nodeHasAllEntriesInPreview(item : Node) : boolean {
  const { preview } = getValue(item) || {};
  if (!preview) {
    return false;
  }

  const {
    entries,
    items,
    length,
    size,
  } = preview;

  return entries
    ? entries.length === size
    : items.length === length;
}

function makeNodesForPromiseProperties(
  item: Node
) : Array<Node> {
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

function makeNodesForEntries(
  item : Node
) : Node {
  const {path} = item;
  const { preview } = getValue(item);
  const nodeName = "<entries>";
  const entriesPath = `${path}/${SAFE_PATH_PREFIX}entries`;

  if (nodeHasAllEntriesInPreview(item)) {
    let entriesNodes = [];
    if (preview.entries) {
      entriesNodes = preview.entries.map(([key, value], index) => {
        return createNode(item, index, `${entriesPath}/${index}`, {
          value: GripMapEntryRep.createGripMapEntry(key, value)
        });
      });
    } else if (preview.items) {
      entriesNodes = preview.items.map((value, index) => {
        return createNode(item, index, `${entriesPath}/${index}`, {value});
      });
    }
    return createNode(item, nodeName, entriesPath, entriesNodes, NODE_TYPES.ENTRIES);
  }
  return createNode(item, nodeName, entriesPath, null, NODE_TYPES.ENTRIES);
}

function makeNodesForMapEntry(
  item: Node
) : Array<Node> {
  const nodeValue = getValue(item);
  if (!nodeValue || !nodeValue.preview) {
    return [];
  }

  const {key, value} = nodeValue.preview;
  const path = item.path;

  return [
    createNode(item, "<key>", `${path}/##key`, {value: key}, NODE_TYPES.MAP_ENTRY_KEY),
    createNode(item, "<value>", `${path}/##value`, {value}, NODE_TYPES.MAP_ENTRY_VALUE),
  ];
}

function getNodeGetter(item: Node): ?Object {
  return get(item, "contents.get", undefined);
}

function getNodeSetter(item: Node): ?Object {
  return get(item, "contents.set", undefined);
}

function makeNodesForAccessors(item: Node) : Array<Node> {
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
  parent: Node,
  ownProperties: Object
) : Array<Node> {
  const parentPath = parent.path;
  const numProperties = propertiesNames.length;
  const numBuckets = Math.ceil(numProperties / bucketSize);
  let buckets = [];
  for (let i = 1; i <= numBuckets; i++) {
    const bucketKey = `${SAFE_PATH_PREFIX}bucket${i}`;
    const minKey = (i - 1) * bucketSize;
    const maxKey = Math.min(i * bucketSize - 1, numProperties - 1);
    const bucketName = `[${minKey}…${maxKey}]`;
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
  parent: Node,
  ownProperties: Object
) : Array<Node> {
  const parentPath = parent.path;

  const userPropertiesNames = [];
  const defaultProperties = [];

  propertiesNames.forEach(name => {
    if (isDefaultWindowProperty(name)) {
      defaultProperties.push(name);
    } else {
      userPropertiesNames.push(name);
    }
  });

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
  parent: Node,
  ownProperties: Object
) : Array<Node> {
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
  parent: Node,
  {
    bucketSize = 100
  } : Object = {}
) : Array<Node> {
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

  if (nodeHasEntries(parent)) {
    nodes.push(makeNodesForEntries(parent));
  }

  // Add the prototype if it exists and is not null
  if (prototype && prototype.type !== "null") {
    nodes.push(
      createNode(
        parent,
        "__proto__",
        `${parentPath}/__proto__`,
        { value: prototype },
        NODE_TYPES.PROTOTYPE
      )
    );
  }

  return nodes;
}

function createNode(
  parent: Node,
  name: string,
  path: string,
  contents: any,
  type: ?Symbol = NODE_TYPES.GRIP
) : ?Node {
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
  node: Node,
  children: Array<Node>
) : Node {
  node.contents = children;
  return node;
}

function getChildren(options: {
  actors: Object,
  getObjectEntries: (RdpGrip) => ?LoadedEntries,
  getObjectProperties: (RdpGrip) => ?LoadedProperties,
  item: Node
}) : Array<Node> {
  const {
    actors = {},
    getObjectEntries,
    getObjectProperties,
    item
  } = options;
  // Nodes can either have children already, or be an object with
  // properties that we need to go and fetch.
  if (nodeHasAccessors(item)) {
    return makeNodesForAccessors(item);
  }

  if (nodeIsMapEntry(item)) {
    return makeNodesForMapEntry(item);
  }

  if (nodeHasChildren(item)) {
    return item.contents;
  }

  if (!nodeHasProperties(item) && !nodeIsEntries(item)) {
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

  let loadedProps;
  if (nodeIsEntries(item)) {
    // If `item` is an <entries> node, we need to get the entries
    // matching the parent node actor.
    const parent = getParent(item);
    loadedProps = getObjectEntries(
      get(getValue(parent), "actor", undefined)
    );
  } else {
    loadedProps = getObjectProperties(
      get(getValue(item), "actor", undefined)
    );
  }

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

function getParent(item: Node) : Node | null {
  return item.parent;
}

module.exports = {
  createNode,
  getChildren,
  getParent,
  getValue,
  makeNodesForEntries,
  makeNodesForPromiseProperties,
  makeNodesForProperties,
  nodeHasAccessors,
  nodeHasAllEntriesInPreview,
  nodeHasChildren,
  nodeHasEntries,
  nodeHasProperties,
  nodeIsDefaultProperties,
  nodeIsEntries,
  nodeIsFunction,
  nodeIsGetter,
  nodeIsMapEntry,
  nodeIsMissingArguments,
  nodeIsObject,
  nodeIsOptimizedOut,
  nodeIsPrimitive,
  nodeIsPromise,
  nodeIsPrototype,
  nodeIsSetter,
  nodeIsWindow,
  nodeSupportsBucketing,
  setNodeChildren,
  sortProperties,
  NODE_TYPES,
  // Export for testing purpose.
  SAFE_PATH_PREFIX,
};
