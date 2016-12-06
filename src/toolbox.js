const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const { bindActionCreators, combineReducers } = require("redux");
const ReactDOM = require("react-dom");

const Rep = createFactory(require("./reps/rep").Rep);
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
              ["long", "tiny", "short"].map(mode =>
               renderRep({ object: result.result, mode })
             )
           )
         )
      ),
      root
    )
  })
}

function renderRep({ object, mode }) {
  return dom.div(
    {
      className: `rep-element ${mode}`,
      key: JSON.stringify(object) + mode
    },
    Rep({ object, defaultRep: Grip, mode })
  )
}


window.eval = function(input) {
  client.evaluate(input, {}).then(r => {
    ReactDOM.render(
      renderRep({ object: r.result, mode: "long" }),
      root
    );
  })
}



const exps = [
  "x = {a: 2}",
  "() => (a,b) => { console.log('hi')}",
  "y = function foo() { console.log('ive got stamina') }",
  "z = [1, 'foo']"
]


let root = document.createElement("div")
root.innerText = "YO";

bootstrap(React, ReactDOM, root)
  .then(onConnect);
