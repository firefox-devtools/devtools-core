/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { DOM: dom, PropTypes } = React;
require("./QuickLinks.css");
const samples = require("../samples.js");

const QuickLinks = React.createClass({

  displayName: "QuickLinks",

  propTypes: {
    evaluate: PropTypes.func.isRequired
  },

  evaluateExpressions(expressions) {
    expressions.forEach(
      expression => this.props.evaluate(expression)
    );
  },

  renderLinks() {
    return Object.keys(samples)
      .map(label => {
        let expressions = samples[label];
        let length = expressions.length;
        return dom.button(
          {
            key: label,
            title: label === "yolo"
              ? "Add all sample expressions"
              : `Add ${length} ${label} sample expression${length > 1 ? "s" : ""}`,
            onClick: () => this.evaluateExpressions(expressions)
          },
          label
        );
      });
  },

  render() {
    return dom.div(
      { className: "quick-links" },
      this.renderLinks()
    );
  }
});

module.exports = QuickLinks;
