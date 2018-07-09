/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { Component } = React;
const PropTypes = require("prop-types");
const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");
const { getTabs, getFilterString, getConfig } = require("../selectors");
const { getValue } = require("devtools-config");
const LandingPage = React.createFactory(require("./LandingPage"));

class LaunchpadApp extends Component {
  static get propTypes() {
    return {
      tabs: PropTypes.object.isRequired,
      filterString: PropTypes.string,
      actions: PropTypes.object,
      config: PropTypes.object
    };
  }

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
}

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
