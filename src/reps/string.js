
const React = require("devtools/client/shared/vendor/react");
const { cropMultipleLines } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a string. String value is enclosed within quotes.
 */
const StringRep = React.createClass({
  displayName: "StringRep",

  propTypes: {
    useQuotes: React.PropTypes.bool,
  },

  getDefaultProps: function () {
    return {
      useQuotes: true,
    };
  },

  render: function () {
    let text = this.props.object;
    let member = this.props.member;
    if (member && member.open) {
      return (
        span({className: "objectBox objectBox-string"},
          "\"" + text + "\""
        )
      );
    }

    let croppedString = this.props.cropLimit ?
      cropMultipleLines(text, this.props.cropLimit) : cropMultipleLines(text);

    let formattedString = this.props.useQuotes ?
      "\"" + croppedString + "\"" : croppedString;

    return (
      span({className: "objectBox objectBox-string"}, formattedString
      )
    );
  },
});

function supportsObject(object, type) {
  return (type == "string");
}

module.exports = {
  rep: StringRep,
  supportsObject: supportsObject,
};
