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
      expressions,
      evaluateInput,
      clearExpressions,
      showResultPacket,
      hideResultPacket,
    } = this.props;

    return dom.main({},
      Header({
        evaluate: evaluateInput,
        clearResultsList: clearExpressions
      }),
      ResultsList({
        expressions: expressions.reverse(),
        showResultPacket: showResultPacket,
        hideResultPacket: hideResultPacket,
      })
    );
  }
});

function mapStateToProps(state) {
  return {
    expressions: selectors.getExpressions(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(require("../actions"), dispatch);
}

module.exports = connect(
    mapStateToProps,
    mapDispatchToProps
)(Console);
