const React = require("react");
const { createFactory, DOM: dom, PropTypes } = React;

const constants = require("../constants");
const QuickLinks = createFactory(require("./QuickLinks"));
require("./Header.css");

const Header = React.createClass({

  displayName: "Header",

  propTypes: {
    addInput: PropTypes.func.isRequired,
    changeCurrentInput: PropTypes.func.isRequired,
    clearResultsList: PropTypes.func.isRequired,
    currentInputValue: PropTypes.string,
    evaluate: PropTypes.func.isRequired,
    navigateInputHistory: PropTypes.func.isRequired,
  },

  onSubmitForm: function (e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let expression = data.get("expression");
    this.props.addInput(expression);
  },

  onInputChange: function (e) {
    this.props.changeCurrentInput(e.target.value);
  },

  onInputKeyDown: function (e) {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      this.props.navigateInputHistory(e.key === "ArrowUp"
        ? constants.DIR_BACKWARD
        : constants.DIR_FORWARD
      );
    }
  },

  onClearButtonClick: function (e) {
    this.props.clearResultsList();
  },

  render() {
    let {
      currentInputValue,
      evaluate,
    } = this.props;

    return dom.header(
      { className: "console-header" },
      dom.form(
        { onSubmit: this.onSubmitForm, },
        dom.h1({}, "Reps"),
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression",
          value: currentInputValue || "",
          autoFocus: true,
          onChange: this.onInputChange,
          onKeyDown: this.onInputKeyDown,
        }),
        dom.button({
          className: "clear-button",
          type: "button",
          onClick: this.onClearButtonClick
        }, "Clear"),
      ),
      QuickLinks({ evaluate })
    );
  }
});

module.exports = Header;
