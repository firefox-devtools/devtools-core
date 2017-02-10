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
 * Used to render JS built-in Date() object.
 */
let DateTime = React.createClass({
  displayName: "Date",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: grip
      }, grip.class + " ");
    }
    return "";
  },

  render: wrapRender(function () {
    let grip = this.props.object;
    let date;
    try {
      date = span({className: "objectBox"},
        this.getTitle(grip),
        span({className: "Date"},
          new Date(grip.preview.timestamp).toISOString()
        )
      );
    } catch (e) {
      date = span({className: "objectBox"}, "Invalid Date");
    }

    return date;
  }),
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (type == "Date" && grip.preview);
}

// Exports from this module
module.exports = {
  rep: DateTime,
  supportsObject: supportsObject
};
