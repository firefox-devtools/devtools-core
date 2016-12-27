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
    dom.a({ href: `${githubUrl}/CONTRIBUTING.md#${urlPart}` }, "docs"),
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
  },

  displayName: "LandingPage",

  getInitialState() {
    return {
      selectedPane: "Firefox"
    };
  },

  onFilterChange(newFilterString) {
    this.props.onFilterChange(newFilterString);
  },

  onSideBarItemClick(itemTitle) {
    this.setState({ selectedPane: itemTitle });
    this.onFilterChange("");
  },

  renderTabs(tabs, paramName) {
    if (!tabs || tabs.count() == 0) {
      return dom.div({}, "");
    }

    return dom.div(
      { className: "tab-group" },
      dom.ul(
        { className: "tab-list" },
        tabs.valueSeq().map(tab => dom.li(
          { "className": "tab",
            "key": tab.get("id"),
            "onClick": () => {
              window.location = getTabURL(tab, paramName);
            }
          },
          dom.div({ className: "tab-title" }, tab.get("title")),
          dom.div({ className: "tab-url" }, tab.get("url"))
        ))
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
        dom.h2({ className: "title" }, name),
        dom.input({
          placeholder: "Filter tabs",
          value: filterString,
          onChange: e => this.onFilterChange(e.target.value)
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

            onClick: () => this.onSideBarItemClick(title)
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
