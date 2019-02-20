/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { Component } = React;
const dom = require("react-dom-factories");
const PropTypes = require("prop-types");
const panelItems = require("../constants").sidePanelItems;
const Svg = require("../../assets/Svg.js");
require("./Sidebar.css");

class Sidebar extends Component {
  static get propTypes() {
    return {
      supportsFirefox: PropTypes.bool.isRequired,
      supportsChrome: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      selectedPane: PropTypes.string.isRequired,
      onSideBarItemClick: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  renderTitle(title) {
    return dom.div(
      { className: "sidebar-title" },
      dom.h1({}, title),
      dom.div(
        { className: "sidebar-subtitle" },
        Svg({ name: "rocket" }),
        dom.h2({}, "Launchpad")
      )
    );
  }

  renderItem(title) {
    const selected = title == this.props.selectedPane;

    let displayTitle;
    if (title === "Firefox") {
      displayTitle = "Firefox Nightly";
    }

    return dom.li(
      { key: title },
      dom.a(
        {
          "aria-current": selected ? "page" : undefined,
          href: "#" + title,
          onClick: () => {
            this.props.onSideBarItemClick(title);
          }
        },
        displayTitle || title
      )
    );
  }

  render() {
    let items = [];

    if (this.props.supportsFirefox) {
      items.push(panelItems.Firefox.name);
    }

    if (this.props.supportsChrome) {
      items.push(panelItems.Chrome.name, panelItems.Node.name);
    }

    items.push(panelItems.Settings.name);

    return dom.aside(
      {
        className: "sidebar"
      },
      this.renderTitle(this.props.title),
      dom.ul(
        {
          className: "sidebar-links"
        },
        items.map(this.renderItem)
      )
    );
  }
}

module.exports = Sidebar;
