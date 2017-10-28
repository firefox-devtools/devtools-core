import React from "react";
import createReactClass from "create-react-class";
import dom from "react-dom-factories";

import _Variables from "./Variables";
const Variables = React.createFactory(_Variables);

require("./layout.css");

const Layout = createReactClass({
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
