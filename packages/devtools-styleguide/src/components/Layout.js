import React from "react";
import PropTypes from "prop-types";
const dom = React.DOM;

import _Variables from "./Variables";
const Variables = React.createFactory(_Variables);

require("./layout.css");

const Layout = React.createClass({
  propTypes: {},

  render() {
    return dom.div(
      {},
      dom.div(
        { className: "navBar" },
        dom.div({ className: "content" }, "Style Guide")
      ),
      dom.div({ className: "content" }, Variables())
    );
  }
});

export default Layout;
