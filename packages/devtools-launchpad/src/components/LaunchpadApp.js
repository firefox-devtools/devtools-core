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
    const {
      filterString,
      actions: { setValue, filterTabs }, config } = this.props;

    return LandingPage({
      tabs: this.props.tabs,
      supportsFirefox: !!getValue("firefox"),
      supportsChrome: !!getValue("chrome"),
      title: getValue("title"),
      filterString,
      onFilterChange: filterTabs,
      onTabClick: (url) => {
        window.location = url;
      },
      config,
      setValue
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
