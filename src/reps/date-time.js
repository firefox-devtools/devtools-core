
const React = require("react");

// Reps
const { isGrip } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Used to render JS built-in Date() object.
 */
let DateTime = React.createClass({
  displayName: "Date",

  propTypes: {
    object: React.PropTypes.object.isRequired
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: grip
      }, grip.class + " ");
    }
    return "";
  },

  render: function () {
    let grip = this.props.object;
    return (
      span({className: "objectBox"},
        this.getTitle(grip),
        span({className: "Date"},
          new Date(grip.preview.timestamp).toISOString()
        )
      )
    );
  },
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (type == "Date" && grip.preview);
}

module.exports = {
  rep: DateTime,
  supportsObject: supportsObject
};
