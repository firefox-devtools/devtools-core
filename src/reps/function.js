
const React = require("devtools/client/shared/vendor/react");

// Reps
const { isGrip, cropString } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * This component represents a template for Function objects.
 */
let Func = React.createClass({
  displayName: "Func",

  propTypes: {
    object: React.PropTypes.object.isRequired
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

  render: function () {
    let grip = this.props.object;

    return (
      span({className: "objectBox objectBox-function"},
        this.getTitle(grip),
        this.summarizeFunction(grip)
      )
    );
  },
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return (type == "function");
  }

  return (type == "Function");
}

module.exports = {
  rep: Func,
  supportsObject: supportsObject
};
