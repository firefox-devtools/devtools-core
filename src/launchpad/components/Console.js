const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;

const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");
const selectors = require("../selectors");

const Header = createFactory(require("./Header"));
const ResultsList = createFactory(require("./ResultsList"));

require("./Console.css");

const Console = React.createClass({
  propTypes: {
    client: PropTypes.object.isRequired
  },

  displayName: "Console",

  render: function() {
    let {
      addInput,
      changeCurrentInput,
      clearExpressions,
      currentInputValue,
      evaluateInput,
      expressions,
      hideResultPacket,
      navigateInputHistory,
      showResultPacket,
    } = this.props;

    return dom.main({},
      Header({
        addInput,
        changeCurrentInput,
        clearResultsList: clearExpressions,
        currentInputValue,
        evaluate: evaluateInput,
        navigateInputHistory,
      }),
      ResultsList({
        expressions: expressions.reverse(),
        hideResultPacket,
        showResultPacket,
      })
    );
  }
});

function mapStateToProps(state) {
  return {
    expressions: selectors.getExpressions(state),
    currentInputValue: selectors.getCurrentInputValue(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(require("../actions"), dispatch);
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Console);
