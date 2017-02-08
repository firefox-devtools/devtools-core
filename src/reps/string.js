// Dependencies
const React = require("react");

const {
  escapeString,
  rawCropString,
  sanitizeString,
  wrapRender,
} = require("./rep-utils");

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
    object: React.PropTypes.string.isRequired,
    member: React.PropTypes.any,
    cropLimit: React.PropTypes.number,
  },

  getDefaultProps: function () {
    return {
      useQuotes: true,
    };
  },

  render: wrapRender(function () {
    let text = this.props.object;
    let member = this.props.member;
    let style = this.props.style;

    let config = {className: "objectBox objectBox-string"};
    if (style) {
      config.style = style;
    }

    if (this.props.useQuotes) {
      text = escapeString(text);
    } else {
      text = sanitizeString(text);
    }

    if ((!member || !member.open) && this.props.cropLimit) {
      text = rawCropString(text, this.props.cropLimit);
    }

    return span(config, text);
  }),
});

function supportsObject(object, type) {
  return (type == "string");
}

// Exports from this module

module.exports = {
  rep: StringRep,
  supportsObject: supportsObject,
};
