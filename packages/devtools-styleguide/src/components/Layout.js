import React from "react";
const { Component } = React;
const dom = require("react-dom-factories");
const { div } = dom;

import _Variables from "./Variables";
const Variables = React.createFactory(_Variables);

require("./layout.css");

class Layout extends Component {
  static get propTypes() {
    return {};
  }

  render() {
    return div(
      {},
      div(
        { className: "navBar" },
        div({ className: "content" }, "Style Guide")
      ),
      div({ className: "content" }, Variables())
    );
  }
}

export default Layout;
