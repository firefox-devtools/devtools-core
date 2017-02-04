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


### History

The Reps project was ported to Github January 18th, 2017. You can view the history of a file after that date on [github][history] or by running this query:

```bash
git log --before "2017-1-17" devtools/client/shared/components/reps
```

[history]: https://github.com/mozilla/gecko-dev/commits/master/devtools/client/shared/components/reps
