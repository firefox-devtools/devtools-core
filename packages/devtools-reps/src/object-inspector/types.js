/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export type GripProperties = {
  ownProperties?: Object,
  ownSymbols?: Array<Object>,
  safeGetterValues?: Object,
  prototype?: Object
};

export type NodeContents = {
  value: ObjectInspectorItemContentsValue,
};

export type NodeMeta = {
  startIndex: number,
  endIndex: number,
};

export type Node = {
  contents: Array<Node> | NodeContents,
  name: string,
  path: string,
  type: ?Symbol,
  meta: ?NodeMeta,
};

export type RdpGrip = {
  actor: string,
  class: string,
  displayClass: string,
  extensible: boolean,
  frozen: boolean,
  ownPropertyLength: number,
  preview: Object,
  sealed: boolean,
  type: string,
};

export type PropertiesIterator = {
  count: number,
  slice: (start: number, count: number) => Promise<GripProperties>
}

export type ObjectClient = {
  enumEntries: () => Promise<PropertiesIterator>,
  enumProperties: (options: Object) => Promise<PropertiesIterator>,
  enumSymbols: () => Promise<PropertiesIterator>,
  getPrototype: () => Promise<{prototype: Object}>,
};

export type CachedNodes = Map<string, Array<Node>>;

export type LoadedProperties = Map<string, GripProperties>;
