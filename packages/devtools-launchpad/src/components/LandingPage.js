/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const createReactClass = require("create-react-class");
const PropTypes = require("prop-types");
const dom = require("react-dom-factories");

require("./LandingPage.css");
const ImPropTypes = require("react-immutable-proptypes");
const configMap = require("../constants").sidePanelItems;
const Tabs = React.createFactory(require("./Tabs"));
const Sidebar = React.createFactory(require("./Sidebar"));
const Settings = React.createFactory(require("./Settings"));

const githubUrl = "https://github.com/devtools-html/debugger.html/blob/master";

function getTabsByClientType(tabs, clientType) {
  return tabs.valueSeq().filter(tab => tab.get("clientType") == clientType);
}

function firstTimeMessage(title, urlPart) {
  return dom.div(
    { className: "footer-note" },
    `First time connecting to ${title}? Checkout out the `,
    dom.a(
      {
        href: `${githubUrl}/docs/getting-setup.md#starting-${urlPart}`,
        target: "_blank"
      },
      "docs"
    ),
    "."
  );
}

const LandingPage = createReactClass({
  displayName: "LandingPage",

  propTypes: {
    tabs: ImPropTypes.map.isRequired,
    supportsFirefox: PropTypes.bool.isRequired,
    supportsChrome: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    filterString: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    onTabClick: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    setValue: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      selectedPane: configMap.Firefox.name,
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

  renderLaunchOptions() {
    const { selectedPane } = this.state;
    const { name, isUnderConstruction } = configMap[selectedPane];

    const isConnected =
      name === configMap.Firefox.name
        ? this.state.firefoxConnected
        : this.state.chromeConnected;
    const isNodeSelected = name === configMap.Node.name;

    if (isNodeSelected) {
      return dom.div(
        { className: "launch-action-container" },
        dom.h3({}, "Run a node script in the terminal with `--inspect`"),
        isUnderConstruction ? this.renderExperimentalMessage(name) : null
      );
    }

    const connectedStateText = isNodeSelected
      ? null
      : `Please open a tab in ${name}`;

    return isConnected
      ? connectedStateText
      : this.renderLaunchButton(name, isUnderConstruction);
  },

  renderLaunchButton(browserName, isUnderConstruction) {
    return dom.div(
      { className: "launch-action-container" },
      dom.button(
        { onClick: () => this.launchBrowser(browserName) },
        `Launch ${browserName}`
      ),
      isUnderConstruction ? this.renderExperimentalMessage(browserName) : null
    );
  },

  renderExperimentalMessage(browserName) {
    const underConstructionMessage =
      "Debugging is experimental and certain features won't work (i.e, seeing variables, attaching breakpoints)"; // eslint-disable-line max-len

    return dom.div(
      { className: "under-construction" },
      dom.div(
        { className: "under-construction-message" },
        dom.p({}, underConstructionMessage),
        dom.img({ src: "/assets/under_construction.png" }),
        dom.a(
          {
            className: "github-link",
            target: "_blank"
          },
          "Help us make it happen"
        )
      )
    );
  },

  launchBrowser(browser) {
    fetch("/launch", {
      body: JSON.stringify({ browser }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "post"
    })
      .then(resp => {
        if (browser === configMap.Firefox.name) {
          this.setState({ firefoxConnected: true });
        } else {
          this.setState({ chromeConnected: true });
        }
      })
      .catch(err => {
        alert(`Error launching ${browser}. ${err.message}`);
      });
  },

  renderEmptyPanel() {
    return dom.div({ className: "hero" }, this.renderLaunchOptions());
  },

  renderSettings() {
    const { config, setValue } = this.props;

    return dom.div(
      {},
      dom.header({}, dom.h1({}, configMap.Settings.name)),
      Settings({ config, setValue })
    );
  },

  renderFilter() {
    const { selectedPane } = this.state;

    const { tabs, filterString = "" } = this.props;

    const { clientType, paramName } = configMap[selectedPane];

    const targets = getTabsByClientType(tabs, clientType);

    return dom.header(
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
    );
  },

  renderPanel() {
    const { onTabClick, tabs } = this.props;
    const { selectedPane } = this.state;

    const { name, clientType, paramName } = configMap[selectedPane];

    const clientTargets = getTabsByClientType(tabs, clientType);
    const tabsDetected = clientTargets && clientTargets.count() > 0;
    const targets = clientTargets.filter(t => !t.get("filteredOut"));

    const isSettingsPaneSelected = name === configMap.Settings.name;

    if (isSettingsPaneSelected) {
      return this.renderSettings();
    }

    if (!tabsDetected) {
      return this.renderEmptyPanel();
    }

    return dom.div(
      {},
      this.renderFilter(),
      Tabs({ targets, paramName, onTabClick })
    );
  },

  render() {
    const { supportsFirefox, supportsChrome, title } = this.props;
    const { selectedPane } = this.state;
    const { onSideBarItemClick } = this;

    const { name, docsUrlPart } = configMap[selectedPane];

    return dom.div(
      {
        className: "landing-page"
      },
      Sidebar({
        supportsFirefox,
        supportsChrome,
        title,
        selectedPane,
        onSideBarItemClick
      }),
      dom.main(
        { className: "panel" },
        this.renderPanel(),
        firstTimeMessage(name, docsUrlPart)
      )
    );
  }
});

module.exports = LandingPage;
