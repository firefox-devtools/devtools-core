const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const { bindActionCreators, combineReducers } = require("redux");
const ReactDOM = require("react-dom");

const { MODE } = require("./reps/constants");
const Rep = React.createFactory(require("./reps/rep"));
const Grip = require("./reps/grip");


// require("./webconsole.css")
require("./reps.css")
require("./toolbox.css")

const {
  client: { getClient, firefox },
  renderRoot, bootstrap, L10N
} = require("devtools-local-toolbox");

const { getValue, isFirefoxPanel } = require("devtools-config");

if (!isFirefoxPanel()) {
  L10N.setBundle(require("./strings.js"));
  window.l10n = L10N;
}

function onConnect({client} = {}) {
  if (!client) {
    return;
  }

  Promise.all(exps.map(ex => client.clientCommands.evaluate(ex, {}))).then(results => {
      ReactDOM.render(
        dom.div({},
          results.map(result =>
            dom.div(
              {className: "rep-row", key:  JSON.stringify(result)},
              Object.keys(MODE).map(modeKey =>
               renderRep({ object: result.result, modeKey })
             )
           )
         )
      ),
      root
    )
  })
}

function renderRep({ object, modeKey }) {
  return dom.div(
    {
      className: `rep-element ${modeKey}`,
      key: JSON.stringify(object) + modeKey
    },
    Rep({ object, defaultRep: Grip, mode: MODE[modeKey] })
  )
}

const exps = [
  "x = {a: 2}",
  "() => (a,b) => { console.log('hi')}",
  "y = function foo() { console.log('ive got stamina') }",
  "z = [1, 'foo']",
  "Promise.resolve(42)",
  "new Error('Ooops')",
  "new Event()",
  '"a - ".repeat(10000)',
  "new Map()",
  "Infinity",
  "-0",
  "NaN",
  "new RegExp()",
  "window"
]


let root = document.createElement("div")
root.innerText = "YO";

bootstrap(React, ReactDOM, root)
  .then(onConnect);
