const React = require("react");
const { PropTypes } = React;
const { connect } = require("react-redux");
const { getTabs } = require("../selectors");
const { getValue } = require("devtools-config");
const LandingPage = React.createFactory(require("./LandingPage"));

const LaunchpadApp = React.createClass({
  propTypes: {
    tabs: PropTypes.array
  },

  displayName: "LaunchpadApp",

  render() {
    return LandingPage({
      tabs: this.props.tabs,
      supportsFirefox: !!getValue("firefox"),
      supportsChrome: !!getValue("chrome"),
      title: getValue("title")
    });
  }
});

module.exports = connect(
  state => ({
    tabs: getTabs(state)
  })
)(LaunchpadApp);
