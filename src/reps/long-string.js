const React = require("react");
const { sanitizeString, isGrip } = require("./rep-utils");
// Shortcuts
const { span } = React.DOM;

/**
 * Renders a long string grip.
 */
const LongStringRep = React.createClass({
  displayName: "LongStringRep",

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
    let {
      cropLimit,
      member,
      object,
      style,
      useQuotes
    } = this.props;
    let {fullText, initial, length} = object;

    let config = {className: "objectBox objectBox-string"};
    if (style) {
      config.style = style;
    }

    let string = member && member.open
      ? fullText || initial
      : initial.substring(0, cropLimit);

    if (string.length < length) {
      string += "\u2026";
    }
    let formattedString = useQuotes ? `"${string}"` : string;
    return span(config, sanitizeString(formattedString));
  },
});

function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return object.type === "longString";
}

module.exports = {
  rep: LongStringRep,
  supportsObject: supportsObject,
};
