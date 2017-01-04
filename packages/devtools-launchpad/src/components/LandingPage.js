const React = require("react");
const classnames = require("classnames");

require("./LandingPage.css");
const { DOM: dom } = React;
const ImPropTypes = require("react-immutable-proptypes");

const githubUrl = "https://github.com/devtools-html/debugger.html/blob/master";

function getTabsByClientType(tabs, clientType) {
  return tabs.valueSeq()
    .filter(tab => tab.get("clientType") == clientType);
}

function firstTimeMessage(title, urlPart) {
  return dom.div(
    { className: "footer-note" },
    `First time connecting to ${title}? Checkout out the `,
    dom.a({
      href: `${githubUrl}/docs/getting-setup.md#starting-${urlPart}`
    }, "docs"),
    "."
  );
}

function getTabURL(tab, paramName) {
  const tabID = tab.get("id");
  return `/?${paramName}=${tabID}`;
}

const LandingPage = React.createClass({
  propTypes: {
    tabs: ImPropTypes.map.isRequired,
    supportsFirefox: React.PropTypes.bool.isRequired,
    supportsChrome: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    filterString: React.PropTypes.string,
    onFilterChange: React.PropTypes.func.isRequired,
    onTabClick: React.PropTypes.func.isRequired,
  },

  displayName: "LandingPage",

  getInitialState() {
    return {
      selectedPane: "Firefox"
    };
  },

  componentDidUpdate() {
    this.refs.filterInput.focus();
  },

  onFilterChange(newFilterString) {
    this.props.onFilterChange(newFilterString);
  },

  onSideBarItemClick(itemTitle) {
    if (itemTitle !== this.state.selectedPane) {
      this.setState({ selectedPane: itemTitle });
      this.onFilterChange("");
    }
  },

  onTabClick(tab, paramName) {
    this.props.onTabClick(getTabURL(tab, paramName));
  },

  renderTabs(tabs, paramName) {
    if (!tabs || tabs.count() == 0) {
      return dom.div({}, "");
    }

    let tabClassNames = ["tab"];
    if (tabs.size === 1) {
      tabClassNames.push("active");
    }

    return dom.div(
      { className: "tab-group" },
      dom.ul(
        { className: "tab-list" },
        tabs.valueSeq().map(
          tab => dom.li({
            className: classnames("tab", {
              active: tabs.size === 1
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
  },

  renderPanel() {
    const configMap = {
      Firefox: {
        name: "Firefox",
        clientType: "firefox",
        paramName: "firefox-tab",
        docsUrlPart: "firefox"
      },
      Chrome: {
        name: "Chrome",
        clientType: "chrome",
        paramName: "chrome-tab",
        docsUrlPart: "chrome"
      },
      Node: {
        name: "Node",
        clientType: "node",
        paramName: "node-tab",
        docsUrlPart: "node"
      }
    };

    let {
      name,
      clientType,
      paramName,
      docsUrlPart
    } = configMap[this.state.selectedPane];

    let {
      tabs,
      filterString = ""
    } = this.props;

    const targets = getTabsByClientType(tabs, clientType);

    return dom.main({ className: "panel" },
      dom.header(
        {},
        dom.input({
          ref: "filterInput",
          placeholder: "Filter tabs",
          value: filterString,
          autoFocus: true,
          type: "search",
          onChange: e => this.onFilterChange(e.target.value),
          onKeyDown: e => {
            if (targets.size === 1 && e.keyCode === 13) {
              this.onTabClick(targets.first(), paramName);
            }
          }
        })
      ),
      this.renderTabs(targets, paramName),
      firstTimeMessage(name, docsUrlPart)
    );
  },

  renderSidebar() {
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
      dom.h1({}, this.props.title),
      dom.ul(
        {},
        connections.map(title => dom.li(
          {
            className: classnames({
              selected: title == this.state.selectedPane
            }),
            key: title,
            tabIndex: 0,
            role: "button",
            onClick: () => this.onSideBarItemClick(title),
            onKeyDown: e => {
              if (e.keyCode === 13) {
                this.onSideBarItemClick(title);
              }
            }
          },
          dom.a({}, title)
      )))
    );
  },

  render() {
    return dom.div(
      {
        className: "landing-page"
      },
      this.renderSidebar(),
      this.renderPanel()
    );
  }
});

module.exports = LandingPage;
