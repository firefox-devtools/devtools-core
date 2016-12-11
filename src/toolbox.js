const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const { bindActionCreators, combineReducers } = require("redux");
const ReactDOM = require("react-dom");

const { MODE } = require("./reps/constants");
const Rep = createFactory(require("./reps/rep"));
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

  render({
    client,
    expressions: []
  });
}

function onSubmitForm(e, state) {
  e.preventDefault();
  let data = new FormData(e.target);
  let expression = data.get("expression");
  state.client.clientCommands.evaluate(expression, {})
    .then(result => {
      state.expressions.unshift({
        input: expression,
        packet: result,
      });
      render(state);
    })
    .catch(e => {
      console.warn("Error when evaluating", e);
    });
}

function render(state) {
  ReactDOM.render(
    dom.main({},
      dom.form({
          onSubmit: e => onSubmitForm(e, state),
        },
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression"
        })
      ),
      dom.div({className: "results"},
        state.expressions.map(expression =>
          dom.div({
              className: "rep-row",
              key: JSON.stringify(expression)
            },
            dom.div({className: "rep-input"}, expression.input),
            dom.div({className: "reps"},
              renderRepInAllModes({
                object: expression.packet.exception || expression.packet.result
              })
            )
          )
        )
      )
    ),
    // container
    root
  );
}

function renderRepInAllModes({object}) {
  return Object.keys(MODE).map(modeKey =>
     renderRep({ object, modeKey })
   );
}

function renderRep({ object, modeKey }) {
  return dom.div(
    {
      className: `rep-element ${modeKey}`,
      key: JSON.stringify(object) + modeKey,
      "data-mode": modeKey,
    },
    Rep({ object, defaultRep: Grip, mode: MODE[modeKey] })
  );
}

let root = document.createElement("div")
root.innerText = "Waiting for connection";

bootstrap(React, ReactDOM, root)
  .then(onConnect);
