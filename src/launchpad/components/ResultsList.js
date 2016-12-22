const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const Result = createFactory(require("./Result"));

const ResultsList = React.createClass({
  propTypes: {
    expressions: PropTypes.array.isRequired
  },

  displayName: "ResultsList",

  render: function() {
    return dom.div({ className: "expressions" },
      this.props.expressions.map(expression =>
        Result({expression, key: JSON.stringify(expression)}))
    );
  }
});

module.exports = ResultsList;
