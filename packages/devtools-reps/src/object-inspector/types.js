export type ObjectInspectorItemContentsValue = {
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

export type ObjectInspectorItemContents = {
  value: ObjectInspectorItemContentsValue,
};

export type ObjectInspectorItem = {
  contents: Array<ObjectInspectorItem> | ObjectInspectorItemContents,
  name: string,
  path: string,
};
