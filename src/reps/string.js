const React = require("react");
const { cropString } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a string. String value is enclosed within quotes.
 */
const StringRep = React.createClass({
  displayName: "StringRep",

  propTypes: {
    useQuotes: React.PropTypes.bool,
    style: React.PropTypes.object,
  },

  getDefaultProps: function () {
    return {
      useQuotes: true,
    };
  },

  render: function () {
    let text = this.props.object;
    let member = this.props.member;
    let style = this.props.style;

    let config = {className: "objectBox objectBox-string"};
    if (style) {
      config.style = style;
    }

    if (member && member.open) {
      return span(config, "\"" + text + "\"");
    }

    let croppedString = this.props.cropLimit ?
      cropString(text, this.props.cropLimit) : cropString(text);

    let formattedString = this.props.useQuotes ?
      "\"" + croppedString + "\"" : croppedString;

    return span(config, formattedString);
  },
});

function supportsObject(object, type) {
  return (type == "string");
}

module.exports = {
  rep: StringRep,
  supportsObject: supportsObject,
};
