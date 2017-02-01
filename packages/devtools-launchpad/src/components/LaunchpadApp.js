const React = require("react");
const { PropTypes } = React;
const ImPropTypes = require("react-immutable-proptypes");
const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");
const { getTabs, getFilterString, getConfig } = require("../selectors");
const { getValue } = require("devtools-config");
const LandingPage = React.createFactory(require("./LandingPage"));

const LaunchpadApp = React.createClass({
  propTypes: {
    tabs: ImPropTypes.map.isRequired,
    filterString: PropTypes.string,
    actions: PropTypes.object,
    config: PropTypes.object
  },

  displayName: "LaunchpadApp",

  render() {
    return LandingPage({
      tabs: this.props.tabs,
      supportsFirefox: !!getValue("firefox"),
      supportsChrome: !!getValue("chrome"),
      title: getValue("title"),
      filterString: this.props.filterString,
      onFilterChange: this.props.actions.filterTabs,
      onTabClick: (url) => {
        window.location = url;
      },
      config: this.props.config
    });
  }
});

function mapStateToProps(state) {
  return {
    tabs: getTabs(state),
    filterString: getFilterString(state),
    config: getConfig(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(require("../actions"), dispatch)
  };
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(LaunchpadApp);
