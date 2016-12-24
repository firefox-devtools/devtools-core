const React = require("react");
const { connect } = require("react-redux");
const { getTabs } = require("../selectors");
const { getValue } = require("devtools-config");
const LandingPage = require("./LandingPage");

const LaunchpadApp = React.createClass({
  propTypes: {},

  displayName: "LaunchpadApp",

  render() {
    return React.createElement(connect(
      state => ({
        tabs: getTabs(state),
        supportsFirefox: getValue("firefox"),
        supportsChrome: getValue("chrome"),
        title: getValue("title"),
      })
    )(LandingPage));
  }
});

module.exports = LaunchpadApp;
