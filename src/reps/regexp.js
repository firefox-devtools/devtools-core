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
    let grip = this.props.object;
    let objectLink = this.props.objectLink || span;

    return (
      span({className: "objectBox objectBox-regexp"},
        objectLink({
          object: grip,
          className: "regexpSource"
        }, this.getSource(grip))
      )
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
