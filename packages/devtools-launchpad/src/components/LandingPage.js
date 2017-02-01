const React = require("react");

require("./LandingPage.css");
const { DOM: dom } = React;
const ImPropTypes = require("react-immutable-proptypes");
const { showMenu, buildMenu } = require("../menu");

const Tabs = React.createFactory(require("./Tabs"));
const Sidebar = React.createFactory(require("./Sidebar"));

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
    config: React.PropTypes.object
  },

  displayName: "LandingPage",

  getInitialState() {
    return {
      selectedPane: "Firefox",
      config: {},
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

  onConfigContextMenu(event, key) {
    event.preventDefault();
    const conf = this.state.config;

    const setConfig = (name, value) => {
      let config = this.state.config;
      config[name] = value;
      this.setState({ config });
      // make fetch request to set the config
      fetch("/setconfig", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, value })
      });
    };

    const ltrMenuItem = {
      id: "node-menu-ltr",
      label: "ltr",
      disabled: conf[key] === "ltr",
      click: () => setConfig(key, "ltr")
    };

    const rtlMenuItem = {
      id: "node-menu-rtl",
      label: "rtl",
      disabled: conf[key] === "rtl",
      click: () => setConfig(key, "rtl")
    };

    const lightMenuItem = {
      id: "node-menu-light",
      label: "light",
      disabled: conf[key] === "light",
      click: () => setConfig(key, "light")
    };

    const darkMenuItem = {
      id: "node-menu-dark",
      label: "dark",
      disabled: conf[key] === "dark",
      click: () => setConfig(key, "dark")
    };

    const items = {
      "dir": [
        { item: ltrMenuItem },
        { item: rtlMenuItem },
      ],
      "theme": [
        { item: lightMenuItem },
        { item: darkMenuItem }
      ]
    };
    showMenu(event, buildMenu(items[key]));
  },

  renderSettings() {
    const { config } = this.props;
    const features = config.features;
    return dom.div(
      { className: "tab-group" },
      dom.h3({}, "Configurations"),
      this.renderConfig(config),
      dom.h3({}, "Features"),
      this.renderFeatures(features)
    );
  },

  renderConfig(config) {
    return dom.ul(
      { className: "tab-list" },
      dom.li({ className: "tab tab-sides" },
        dom.div({ className: "tab-title" }, "Direction"),
        dom.div({
          className: "tab-value",
          onClick: e => this.onConfigContextMenu(e, "dir")
        }, config.dir),
      ),
      dom.li({ className: "tab tab-sides" },
        dom.div({ className: "tab-title" }, "Theme"),
        dom.div({
          className: "tab-value",
          onClick: e => this.onConfigContextMenu(e, "theme")
        }, config.theme)
      )
    );
  },

  renderFeatures(features) {
    const onInputHandler = (e, key) => {
      features[key] = e.target.checked;
    };
    return dom.ul(
      { className: "tab-list" },
      Object.keys(features).map(key => dom.li(
        {
          className: "tab tab-sides",
          key
        },
        dom.div({ className: "tab-title" },
          typeof features[key] == "object" ?
            features[key].label :
            key
        ),
        dom.div({ className: "tab-value" },
          dom.input(
            {
              type: "checkbox",
              defaultChecked: features[key].enabled,
              onChange: e => onInputHandler(e, key)
            },
          )
        )
      ))
    );
  },

  renderPanel() {
    const { onTabClick } = this.props;
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
    const launchButton = isConnected ? null : dom.input({
      type: "button",
      value: `Launch ${selectedPane}`,
      onClick: () => launchBrowser(selectedPane)
    });
    return dom.main(
      { className: "panel" },
      !isSettingsPaneSelected ?
        dom.header({},
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
          }),
          launchButton
        ) :
        dom.header({}, dom.h1({}, "Settings")),
        isSettingsPaneSelected ?
          this.renderSettings() :
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
