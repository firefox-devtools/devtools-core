/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ReactJS
const { createClass, PropTypes } = require("react");
const { DOM: dom } = require("react-dom");

const { createFactories } = require("devtools-reps");
const { JsonPanel } = createFactories(require("./json-panel"));
const { TextPanel } = createFactories(require("./text-panel"));
const { HeadersPanel } = createFactories(require("./headers-panel"));
const { Tabs, TabPanel } = createFactories(require("devtools-modules"));

/**
 * This object represents the root application template
 * responsible for rendering the basic tab layout.
 */
let MainTabbedArea = createClass({
  displayName: "MainTabbedArea",

  propTypes: {
    jsonText: PropTypes.string,
    tabActive: PropTypes.number,
    actions: PropTypes.object,
    headers: PropTypes.object,
    searchFilter: PropTypes.string,
    json: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array
    ])
  },

  getInitialState: function () {
    return {
      json: {},
      headers: {},
      jsonText: this.props.jsonText,
      tabActive: this.props.tabActive
    };
  },

  onTabChanged: function (index) {
    this.setState({tabActive: index});
  },

  render: function () {
    return (
      Tabs({
        tabActive: this.state.tabActive,
        onAfterChange: this.onTabChanged},
        TabPanel({
          className: "json",
          title: L10N.getStr("jsonViewer.tab.JSON")},
          JsonPanel({
            data: this.props.json,
            jsonTextLength: this.props.jsonText.length,
            actions: this.props.actions,
            searchFilter: this.state.searchFilter
          })
        ),
        TabPanel({
          className: "rawdata",
          title: L10N.getStr("jsonViewer.tab.RawData")},
          TextPanel({
            data: this.state.jsonText,
            actions: this.props.actions
          })
        ),
        TabPanel({
          className: "headers",
          title: L10N.getStr("jsonViewer.tab.Headers")},
          HeadersPanel({
            data: this.props.headers,
            actions: this.props.actions,
            searchFilter: this.props.searchFilter
          })
        )
      )
    );
  }
});

// Exports from this module
exports.MainTabbedArea = MainTabbedArea;
