/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");

require("./Tabs.css");
const { DOM: dom } = React;
const classnames = require("classnames");

function getTabURL(tab, paramName) {
  const tabID = tab.get("id");
  return `/?${paramName}=${tabID}`;
}

const Tabs = React.createClass({
  propTypes: {
    targets: React.PropTypes.object.isRequired,
    paramName: React.PropTypes.string.isRequired,
    onTabClick: React.PropTypes.func.isRequired,
  },

  displayName: "Tabs",

  onTabClick(tab, paramName) {
    this.props.onTabClick(getTabURL(tab, paramName));
  },

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
      { className: "tab-group" },
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

});

module.exports = Tabs;
