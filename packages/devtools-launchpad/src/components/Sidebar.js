/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");

require("./Sidebar.css");
const dom = require("react-dom-factories");
const classnames = require("classnames");
const createReactClass = require("create-react-class");
const PropTypes = require("prop-types");

const Sidebar = createReactClass({
  displayName: "Sidebar",

  propTypes: {
    supportsFirefox: PropTypes.bool.isRequired,
    supportsChrome: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    selectedPane: PropTypes.string.isRequired,
    onSideBarItemClick: PropTypes.func.isRequired
  },

  render() {
    let connections = [];

    if (this.props.supportsFirefox) {
      connections.push("Firefox");
    }

    if (this.props.supportsChrome) {
      connections.push("Chrome", "Node");
    }

    connections.push("Settings");

    return dom.aside(
      {
        className: "sidebar"
      },
      dom.h1({}, this.props.title),
      dom.ul(
        {},
        connections.map(title => dom.li(
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
        )))
    );
  }
});

module.exports = Sidebar;
