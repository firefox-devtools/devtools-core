/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const createReactClass = require("create-react-class");
const PropTypes = require("prop-types");
const dom = require("react-dom-factories");

require("./Sidebar.css");
const classnames = require("classnames");
const Svg = require("../../assets/Svg.js");
const Sidebar = createReactClass({
  displayName: "Sidebar",

  propTypes: {
    supportsFirefox: PropTypes.bool.isRequired,
    supportsChrome: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    selectedPane: PropTypes.string.isRequired,
    onSideBarItemClick: PropTypes.func.isRequired
  },

  renderTitle(title) {
    return dom.div(
      { className: "title-wrapper" },
      dom.h1({}, title),
      dom.div(
        { className: "launchpad-container" },
        Svg({ name: "rocket" }),
        dom.h2({ className: "launchpad-container-title" }, "Launchpad")
      )
    );
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
        this.renderItem("Settings")
      )
    );
  }
});

module.exports = Sidebar;
