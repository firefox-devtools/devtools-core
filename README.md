# DevTools Reps

![](http://g.recordit.co/IxhfRP8pNf.gif)

Reps is Firefox DevTools' remote object formatter. It stands for *representation*.


## Example

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

## What is what?

### `Rep`

`Rep` is the top-level component that is capable of formatting any type.

Supported types:
> RegExp, StyleSheet, Event, DateTime, TextNode, Attribute, Func, ArrayRep, Document, Window, ObjectWithText, ObjectWithURL, GripArray, GripMap, Grip, Undefined, Null, StringRep, Number, SymbolRep,


### `Grip`

`Grip` is a client representation of a remote JS object and is used as an input object for this rep component.


## Getting started

You need to clone the repository, then install dependencies, for which you'll need the [Yarn](https://yarnpkg.com/en/) tool:

```
git clone https://github.com/devtools-html/reps.git
cd reps
yarn install
```

Once everything is installed, you can start the development server with:

```bash
yarn start
```

and navigate to ```http://localhost:8000``` to access the dashboard.


## History

The Reps project was ported to Github January 18th, 2017. You can view the history of a file after that date on [github][history] or by running this query:

```bash
git log --before "2017-1-17" devtools/client/shared/components/reps
```

[history]: https://github.com/mozilla/gecko-dev/commits/master/devtools/client/shared/components/reps


## Publishing to `mozilla-central`

See https://github.com/devtools-html/reps/blob/master/RELEASE.md
