## Developer Tools Reps

![](http://g.recordit.co/IxhfRP8pNf.gif)

Reps is Firefox's remote object formatter. It stands for representation.


### Example

```js
const React = require("react");
let { Rep, Grip } = require("devtools-modules");
Rep = React.createFactory(Rep);

function renderRep({ object, mode }) {
  return Rep({ object, defaultRep: Grip, mode });
}

ReactDOM.render(
  Rep({ object, defaultRep: Grip, mode }),
  document.createElement("div")
);
```

### Rep
Rep is the top-level component that is capable of formatting any type.

Supported types:
> RegExp, StyleSheet, Event, DateTime, TextNode, Attribute, Func, ArrayRep, Document, Window, ObjectWithText, ObjectWithURL, GripArray, GripMap, Grip, Undefined, Null, StringRep, Number, SymbolRep,


### Grip
Grip is client representation of remote JS object and is used as an input object for this rep component.


### Object Inspector

Object Inspector is component responsible for creating the property tree.

In the scopes pane, it receives a set of scopes as the roots. But it is recursive, and subsequent levels it shows property nodes.

* *getObjectProperties* - it expects a way to get loaded properties
* *loadObjectProperties* - it expects a way to fetch new properties

```js
ObjectInspector({
  roots: scopes,
  getObjectProperties: id => loadedObjects.get(id),
  loadObjectProperties
});
```


### Publishing to MC

1. `node bin/publish-assets`
2. copy files from `assets/build` to the correct location
