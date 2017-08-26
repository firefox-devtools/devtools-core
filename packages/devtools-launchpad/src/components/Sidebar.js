/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
import mySvg from "../../assets/rocket.svg";

require("./Sidebar.css");
const { DOM: dom } = React;
const classnames = require("classnames");

const Sidebar = React.createClass({
  displayName: "Sidebar",

  propTypes: {
    supportsFirefox: React.PropTypes.bool.isRequired,
    supportsChrome: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    selectedPane: React.PropTypes.string.isRequired,
    onSideBarItemClick: React.PropTypes.func.isRequired
  },

  renderTitle(title) {
    return dom.div({className: "title-wrapper"},
                    dom.h1({}, "Debugger"),
                    dom.div({className: "launchpad-container"},
                            // dom.span({className: "launchpad-container-icon"}),
                            dom.div({className: "launchpad-container-icon", dangerouslySetInnerHTML: {__html: mySvg }}),
                            dom.h2({className: "launchpad-container-title"}, "Launchpad")));
  },

  renderItem(title) {
    return dom.li(
      {
        className: classnames({
          selected: title == this.props.selectedPane
        }),
        key: title,
        tabIndex: 0,
        role: "button",
        onClick: () => this.props.onSideBarItemClick(title),
        onKeyDown: e => {
          if (e.keyCode === 13) {
            this.props.onSideBarItemClick(title);
          }
        }
      },
      dom.a({}, title)
    );
  },

  render() {
    let connections = [];

    if (this.props.supportsFirefox) {
      connections.push("Firefox");
    }

    if (this.props.supportsChrome) {
      connections.push("Chrome", "Node");
    }

    return dom.aside(
      {
        className: "sidebar"
      },
      this.renderTitle(this.props.title),
      dom.ul(
        {},
        connections.map(title => this.renderItem(title)),
        this.renderItem("Settings")));
  }});

module.exports = Sidebar;
