const React = require("react");

// Reps
const { isGrip, getURLDisplayString } = require("./rep-utils");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders a grip representing a window.
 */
let Window = React.createClass({
  displayName: "Window",

  propTypes: {
    object: React.PropTypes.object.isRequired,
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return DOM.span({className: "objectBox"},
        this.props.objectLink({
          object: grip
        }, grip.class + " ")
      );
    }
    return "";
  },

  getLocation: function (grip) {
    return getURLDisplayString(grip.preview.url);
  },

  render: function () {
    let grip = this.props.object;

    return (
      DOM.span({className: "objectBox objectBox-Window"},
        this.getTitle(grip),
        DOM.span({className: "objectPropValue"},
          this.getLocation(grip)
        )
      )
    );
  },
});

// Registration

function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }

  return (object.preview && type == "Window");
}

module.exports = {
  rep: Window,
  supportsObject: supportsObject
};
