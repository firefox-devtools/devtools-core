import React from "react";
import PropTypes from "prop-types";
const dom = React.DOM;
import postcss from "postcss";

// require("./Variables.css");

function iterate(list, cbk) {
  var index = list.length;
  for (var i = 0; i < index; i++) {
    cbk(list[i]);
  }
}

function map(list, cbk) {
  const acc = [];
  iterate(list, item => acc.push(cbk(item)));
}

function find(list, predicate) {
  let found;
  iterate(list, item => {
    if (!found && predicate(item)) {
      found = item;
    }
  });

  return found;
}

const variableSheet = find(document.styleSheets, sheet =>
  sheet.ownerNode.innerText.match(/DevToolsColors/)
);

async function getVariables() {
  const parsedStyleSheet = await postcss([]).process(
    variableSheet.ownerNode.innerText
  );

  const rules = parsedStyleSheet.root.nodes.filter(n => n.type == "rule");
  const getThemeVars = rule =>
    rule.nodes
      .filter(node => node.type == "decl" && node.prop.match(/--theme/))
      .map(node => ({
        variable: node.prop,
        value: node.value
      }));

  return {
    "Light Theme": getThemeVars(rules[0]),
    "Dark Theme": getThemeVars(rules[1])
  };
}

const Layout = React.createClass({
  propTypes: {},

  componentWillMount() {
    this.state = { variables: [] };
  },

  componentDidMount() {
    getVariables().then(variables => {
      this.setState({ variables });
    });
  },

  renderVariable({ variable, value }) {
    return dom.div(
      { className: "variable-row" },
      dom.div({ className: "color-box", style: { backgroundColor: value } }),
      dom.div({}, variable)
    );
  },

  renderVariableList(theme, variables) {
    return dom.div(
      { className: "theme-variables" },
      dom.h2({}, theme),
      dom.div(
        { className: "variable-list" },
        variables.map(variable => this.renderVariable(variable))
      )
    );
  },

  render() {
    const variables = this.state.variables || [];
    return dom.div(
      {},
      Object.keys(variables).map(theme =>
        this.renderVariableList(theme, variables[theme])
      )
    );
  }
});

export default Layout;
