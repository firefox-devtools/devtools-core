const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const Header = createFactory(require("./Header"));
const ResultsList = createFactory(require("./ResultsList"));

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
      .then(
        result => this.addExpression(expression, result),
        err => console.warn("Error when evaluating expression", err)
      );
  },

  addExpression(expression, result) {
    this.setState(prevState => ({
      expressions: [{
        input: expression,
        packet: result,
      }, ...prevState.expressions]
    }));
  },

  clearResultsList() {
    this.setState(prevState => ({
      expressions: []
    }));
  },

  render: function() {
    return dom.main({},
      Header({
        evaluate: this.evaluate,
        clearResultsList: this.clearResultsList
      }),
      ResultsList({expressions: this.state.expressions})
    );
  }
});

module.exports = Console;
