const React = require("react");
const { createFactory, DOM: dom, PropTypes } = React;

const QuickLinks = createFactory(require("./QuickLinks"));
require("./Header.css");

const Header = React.createClass({

  propTypes: {
    evaluate: PropTypes.func.isRequired,
    clearResultsList: PropTypes.func.isRequired,
  },

  displayName: "Header",

  onSubmitForm: function(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let expression = data.get("expression");
    this.props.evaluate(expression);
  },

  onClearButtonClick: function(e) {
    this.props.clearResultsList();
  },

  render() {
    return dom.header(
      { className: "console-header" },
      dom.form({
          onSubmit: this.onSubmitForm,
        },
        dom.h1({}, "Reps"),
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression"
        }),
        dom.button({
          className: "clear-button",
          type: "button",
          onClick: this.onClearButtonClick
        }, "Clear"),
      ),
      QuickLinks({evaluate: this.props.evaluate})
    );
  }
});

module.exports = Header;
