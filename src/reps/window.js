const React = require("react");
const { MODE } = require("./constants");

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
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
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

  getDisplayValue: function (grip) {
    if (this.props.mode === MODE.TINY) {
      return grip.isGlobal ? "Global" : "Window";
    }

    return this.getLocation(grip);
  },

  render: function () {
    let grip = this.props.object;

    return (
      DOM.span({className: "objectBox objectBox-Window"},
        this.getTitle(grip),
        DOM.span({className: "objectPropValue"},
          this.getDisplayValue(grip)
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
