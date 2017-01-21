// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  cropString,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * This component represents a template for Function objects.
 */
let Func = React.createClass({
  displayName: "Func",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: grip
      }, "function ");
    }
    return "";
  },

  summarizeFunction: function (grip) {
    let name = grip.userDisplayName || grip.displayName || grip.name || "function";
    return cropString(name + "()", 100);
  },

  render: wrapRender(function () {
    let grip = this.props.object;

    return (
      // Set dir="ltr" to prevent function parentheses from
      // appearing in the wrong direction
      span({dir: "ltr", className: "objectBox objectBox-function"},
        this.getTitle(grip),
        this.summarizeFunction(grip)
      )
    );
  }),
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return (type == "function");
  }

  return (type == "Function");
}

// Exports from this module

module.exports = {
  rep: Func,
  supportsObject: supportsObject
};
