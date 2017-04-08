/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const { DOM: dom, createClass, createFactory, PropTypes } = React;
const { LocalizationHelper } = require("../../../shared/l10n");
const Frame = createFactory(require("./frame"));


const AsyncFrame = createFactory(createClass({
  displayName: "AsyncFrame",

  PropTypes: {
    asyncCause: PropTypes.string.isRequired
  },

  render() {
    let { asyncCause } = this.props;

    return dom.span(
      { className: "frame-link-async-cause" },
      l10n.getFormatStr("stacktrace.asyncStack", asyncCause)
    );
  }
}));

const StackTrace = createClass({
  displayName: "StackTrace",

  PropTypes: {
    stacktrace: PropTypes.array.isRequired,
    onViewSourceInDebugger: PropTypes.func.isRequired
  },

  render() {
    let { stacktrace, onViewSourceInDebugger } = this.props;

    let frames = [];
    stacktrace.forEach(s => {
      if (s.asyncCause) {
        frames.push("\t", AsyncFrame({
          asyncCause: s.asyncCause
        }), "\n");
      }

      frames.push("\t", Frame({
        frame: {
          functionDisplayName: s.functionName,
          source: s.filename.split(" -> ").pop(),
          line: s.lineNumber,
          column: s.columnNumber,
        },
        showFunctionName: true,
        showAnonymousFunctionName: true,
        showFullSourceUrl: true,
        onClick: onViewSourceInDebugger
      }), "\n");
    });

    return dom.div({ className: "stack-trace" }, frames);
  }
});

module.exports = StackTrace;
