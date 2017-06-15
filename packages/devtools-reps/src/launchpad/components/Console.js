/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;
const { KeyShortcuts } = require("devtools-modules");
let shortcuts = new KeyShortcuts({ window });

const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");
const selectors = require("../selectors");

const Header = createFactory(require("./Header"));
const ResultsList = createFactory(require("./ResultsList"));

require("./Console.css");

const Console = React.createClass({
  displayName: "Console",

  propTypes: {
    addInput: PropTypes.func.isRequired,
    changeCurrentInput: PropTypes.func.isRequired,
    clearExpressions: PropTypes.func.isRequired,
    currentInputValue: PropTypes.string.isRequired,
    evaluateInput: PropTypes.func.isRequired,
    expressions: PropTypes.object.isRequired,
    hideResultPacket: PropTypes.func.isRequired,
    navigateInputHistory: PropTypes.func.isRequired,
    showResultPacket: PropTypes.func.isRequired,
    loadObjectProperties: PropTypes.func.isRequired,
    loadedObjects: PropTypes.object.isRequired
  },

  componentDidMount: function () {
    shortcuts.on("CmdOrCtrl+Shift+L", this.props.clearExpressions);
  },

  componentWillUnmount: function () {
    shortcuts.off("CmdOrCtrl+Shift+L");
  },

  render: function () {
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
      loadObjectProperties,
      loadedObjects,
    } = this.props;

    return dom.main(
      {},
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
        loadedObjects,
        hideResultPacket,
        showResultPacket,
        loadObjectProperties
      })
    );
  }
});

function mapStateToProps(state) {
  return {
    expressions: selectors.getExpressions(state),
    loadedObjects: selectors.getLoadedObjects(state),
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
