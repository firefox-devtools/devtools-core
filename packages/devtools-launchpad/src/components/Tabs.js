/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");

require("./Tabs.css");
const { Component } = React;
const dom = require("react-dom-factories");
const PropTypes = require("prop-types");
const classnames = require("classnames");

function getTabURL(tab, paramName) {
  const tabID = tab.get("id");
  return `/?react_perf&${paramName}=${tabID}`;
}

class Tabs extends Component {
  static get propTypes() {
    return {
      targets: PropTypes.object.isRequired,
      paramName: PropTypes.string.isRequired,
      onTabClick: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(tab, paramName) {
    this.props.onTabClick(getTabURL(tab, paramName));
  }

  render() {
    const { targets, paramName } = this.props;

    if (!targets || targets.count() == 0) {
      return dom.div({}, "");
    }

    let tabClassNames = ["tab"];
    if (targets.size === 1) {
      tabClassNames.push("active");
    }

    return dom.div(
      { className: "launchpad-tabs" },
      dom.ul(
        { className: "tab-list" },
        targets.valueSeq().map(
          tab => dom.li({
            className: classnames("tab", {
              active: targets.size === 1
            }),
            key: tab.get("id"),
            tabIndex: 0,
            role: "link",
            onClick: () => this.onTabClick(tab, paramName),
            onKeyDown: e => {
              if (e.keyCode === 13) {
                this.onTabClick(tab, paramName);
              }
            }
          },
          dom.div({ className: "tab-title" }, tab.get("title")),
          dom.div({ className: "tab-url" }, tab.get("url"))
          )
        )
      )
    );
  }
}

module.exports = Tabs;
