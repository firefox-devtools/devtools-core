/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { DOM: dom, PropTypes, createFactory } = React;
const ImPropTypes = require("react-immutable-proptypes");

const Result = createFactory(require("./Result"));

const ResultsList = React.createClass({
  displayName: "ResultsList",

  propTypes: {
    expressions: ImPropTypes.map.isRequired,
    showResultPacket: PropTypes.func.isRequired,
    hideResultPacket: PropTypes.func.isRequired,
  },

  render: function () {
    let {
      expressions,
      showResultPacket,
      hideResultPacket,
      loadObjectProperties,
      loadedObjects,
    } = this.props;

    return dom.div({ className: "expressions" },
      expressions
        .entrySeq()
        .toJS()
        .map(([ key, expression ]) =>
        Result({
          key,
          expression: expression.toJS(),
          loadedObjects,
          showResultPacket: () => showResultPacket(key),
          hideResultPacket: () => hideResultPacket(key),
          loadObjectProperties,
        })
      )
    );
  }
});

module.exports = ResultsList;
