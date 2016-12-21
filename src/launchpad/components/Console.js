const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const Header = createFactory(require("./header"));

const { MODE } = require("../../reps/constants");
const Rep = createFactory(require("../../reps/rep"));
const Grip = require("../../reps/grip");

require("./Console.css");

const Console = React.createClass({
  propTypes: {
    client: PropTypes.object.isRequired
  },

  displayName: "Console",

  getInitialState: function() {
    return {
      expressions: []
    };
  },

  evaluate(expression) {
    this.props.client.clientCommands.evaluate(expression, {})
      .then(result => this.addExpression(expression, result))
      .catch(e => {
        console.warn("Error when evaluating", e);
      });
  },

  addExpression(expression, result) {
    this.setState(prevState => ({
      expressions: [{
        input: expression,
        packet: result,
      }, ...prevState.expressions]
    }));
  },

  renderRepInAllModes: function({ object }) {
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

  renderResult(expression) {
    const object = expression.packet.exception || expression.packet.result;
    return dom.div(
      {
        className: "rep-row",
        key: JSON.stringify(expression)
      },
      dom.div({ className: "rep-input" }, expression.input),
      dom.div({ className: "reps" }, this.renderRepInAllModes({ object }))
    );
  },

  render: function() {
    return dom.main({},
      Header({ evaluate: this.evaluate }),
      dom.div(
        { className: "results" },
        this.state.expressions.map(this.renderResult)
      )
    );
  }
});

module.exports = Console;
