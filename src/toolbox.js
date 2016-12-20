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

const { renderRoot, bootstrap, L10N } = require("devtools-launchpad");
const { getValue, isFirefoxPanel } = require("devtools-config");

if (!isFirefoxPanel()) {
  L10N.setBundle(require("./strings.js"));
  window.l10n = L10N;
}

function onConnect({client} = {}) {
  if (!client) {
    return;
  }

  ReactDOM.render(
    (React.createFactory(RepsConsole))({client}),
    root
  );
}

RepsConsole = React.createClass({
  getInitialState: function() {
    return {
      expressions: []
    };
  },

  propTypes: {
    client: React.PropTypes.object.isRequired
  },

  onSubmitForm: function(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let expression = data.get("expression");
    this.props.client.clientCommands.evaluate(expression, {})
      .then(result => {
        this.setState(function(prevState, props) {
          return {
            expressions: [{
              input: expression,
              packet: result,
            }, ...prevState.expressions]
          };
        });
      })
      .catch(e => {
        console.warn("Error when evaluating", e);
      });
  },

  renderRepInAllModes: function({object}) {
    return Object.keys(MODE).map(modeKey =>
       this.renderRep({ object, modeKey })
     );
  },

  renderRep: function({ object, modeKey }) {
    return dom.div(
      {
        className: `rep-element ${modeKey}`,
        key: JSON.stringify(object) + modeKey,
        "data-mode": modeKey,
      },
      Rep({ object, defaultRep: Grip, mode: MODE[modeKey] })
    );
  },

  render: function() {
    return dom.main({},
      dom.form({
          onSubmit: this.onSubmitForm,
        },
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression"
        })
      ),
      dom.div({className: "results"},
        this.state.expressions.map(expression =>
          dom.div({
              className: "rep-row",
              key: JSON.stringify(expression)
            },
            dom.div({className: "rep-input"}, expression.input),
            dom.div({className: "reps"},
              this.renderRepInAllModes({
                object: expression.packet.exception || expression.packet.result
              })
            )
          )
        )
      )
    );
  }
});

let root = document.createElement("div")
root.innerText = "Waiting for connection";

bootstrap(React, ReactDOM, root)
  .then(onConnect);
