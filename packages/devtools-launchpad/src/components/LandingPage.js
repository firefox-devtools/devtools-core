const React = require("react");

require("./LandingPage.css");
const { DOM: dom } = React;
const ImPropTypes = require("react-immutable-proptypes");

const Tabs = React.createFactory(require("./Tabs"));
const Sidebar = React.createFactory(require("./Sidebar"));
const Settings = React.createFactory(require("./Settings"));

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

const LandingPage = React.createClass({
  propTypes: {
    tabs: ImPropTypes.map.isRequired,
    supportsFirefox: React.PropTypes.bool.isRequired,
    supportsChrome: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    filterString: React.PropTypes.string,
    onFilterChange: React.PropTypes.func.isRequired,
    onTabClick: React.PropTypes.func.isRequired,
    config: React.PropTypes.object.isRequired,
    setValue: React.PropTypes.func.isRequired
  },

  displayName: "LandingPage",

  getInitialState() {
    return {
      selectedPane: "Firefox",
      firefoxConnected: false,
      chromeConnected: false
    };
  },

  componentDidUpdate() {
    if (this.refs.filterInput) {
      this.refs.filterInput.focus();
    }
  },

  onFilterChange(newFilterString) {
    this.props.onFilterChange(newFilterString);
  },

  onSideBarItemClick(itemTitle) {
    if (itemTitle !== this.state.selectedPane) {
      this.setState({ selectedPane: itemTitle });
    }
  },

  renderPanel() {
    const { onTabClick, config, setValue } = this.props;
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
      },
      Settings: {
        name: "Settings",
        clientType: "settings",
        paramName: "settings-tab",
        docsUrlPart: "settings"
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

    let { selectedPane } = this.state;

    const targets = getTabsByClientType(tabs, clientType);
    const isSettingsPaneSelected = name === "Settings";
    const isNodeSelected = name === configMap.Node.name;
    const currentTargetsExist = targets && targets.count() > 0;

    const launchBrowser = (browser) => {
      fetch("/launch", {
        body: JSON.stringify({ browser }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "post"
      })
      .then(resp => {
        if (browser == "firefox") {
          this.setState({ firefoxConnected: true });
        } else {
          this.setState({ chromeConnected: true });
        }
      })
      .catch(err => {
        alert(`Error launching ${browser}. ${err.message}`);
      });
    };

    const isConnected = name == "Firefox"
      ? this.state.firefoxConnected
      : this.state.chromeConnected;

    const connectedStateText = isNodeSelected ?
      null : `Please open a tab in ${name}`;

    const launchButton = isConnected ? connectedStateText : dom.input({
      type: "button",
      value: `Launch ${selectedPane}`,
      onClick: () => launchBrowser(selectedPane)
    });

    const targetsContent = currentTargetsExist ? dom.header({},
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
    ) : dom.div({ className: "hero" }, launchButton);

    return dom.main(
      { className: "panel" },
      !isSettingsPaneSelected ?
        targetsContent :
        dom.header({},
          dom.h1({}, "Settings")),
          isSettingsPaneSelected ?
          Settings({ config, setValue }) :
          Tabs({ targets, paramName, onTabClick }),
        firstTimeMessage(name, docsUrlPart)
    );
  },

  render() {
    const { supportsFirefox, supportsChrome, title } = this.props;
    const { selectedPane } = this.state;
    const { onSideBarItemClick } = this;
    return dom.div(
      {
        className: "landing-page"
      },
      Sidebar({
        supportsFirefox, supportsChrome, title,
        selectedPane, onSideBarItemClick
      }),
      this.renderPanel()
    );
  }
});

module.exports = LandingPage;
