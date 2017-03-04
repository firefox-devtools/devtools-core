// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a grip object with regular expression.
 */
let RegExp = React.createClass({
  displayName: "regexp",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
  },

  getSource: function (grip) {
    return grip.displayString;
  },

  render: wrapRender(function () {
    let {object} = this.props;
    let objectLink = (config, ...children) => {
      if (this.props.objectLink) {
        return this.props.objectLink(Object.assign({object}, config), ...children);
      }
      return span(config, ...children);
    };

    return (
      objectLink({
        className: "objectBox objectBox-regexp regexpSource"
      }, this.getSource(object))
    );
  }),
});

// Registration

function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }

  return (type == "RegExp");
}

// Exports from this module
module.exports = {
  rep: RegExp,
  supportsObject: supportsObject
};
