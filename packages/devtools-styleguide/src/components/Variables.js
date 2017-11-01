import React from "react";
const { Component } = React;
import dom from "react-dom-factories";
const { div, h2 } = dom;
import postcss from "postcss";

// require("./Variables.css");

function iterate(list, cbk) {
  let index = list.length;
  for (let i = 0; i < index; i++) {
    cbk(list[i]);
  }
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

class Layout extends Component {
  static get propTypes() {
    return {};
  }

  constructor(props) {
    super(props);
    this.renderVariable = this.renderVariable.bind(this);
    this.renderVariableList = this.renderVariableList.bind(this);
  }

  componentWillMount() {
    this.state = { variables: [] };
  }

  componentDidMount() {
    getVariables().then(variables => {
      this.setState({ variables });
    });
  }

  renderVariable({ variable, value }) {
    return div(
      { className: "variable-row" },
      div({ className: "color-box", style: { backgroundColor: value } }),
      div({}, variable)
    );
  }

  renderVariableList(theme, variables) {
    return div(
      { className: "theme-variables" },
      h2({}, theme),
      div(
        { className: "variable-list" },
        variables.map(variable => this.renderVariable(variable))
      )
    );
  }

  render() {
    const variables = this.state.variables || [];
    return div(
      {},
      Object.keys(variables).map(theme =>
        this.renderVariableList(theme, variables[theme])
      )
    );
  }
}

export default Layout;
