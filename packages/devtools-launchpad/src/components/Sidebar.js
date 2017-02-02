const React = require("react");

require("./Sidebar.css");
const { DOM: dom } = React;
const classnames = require("classnames");

const Sidebar = React.createClass({

  propTypes: {
    supportsFirefox: React.PropTypes.bool.isRequired,
    supportsChrome: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    selectedPane: React.PropTypes.string.isRequired,
    onSideBarItemClick: React.PropTypes.func.isRequired
  },

  displayName: "Sidebar",

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
