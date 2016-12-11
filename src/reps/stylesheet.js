const React = require("react");

// Reps
const { isGrip, getURLDisplayString } = require("./rep-utils");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders a grip representing CSSStyleSheet
 */
let StyleSheet = React.createClass({
  displayName: "object",

  propTypes: {
    object: React.PropTypes.object.isRequired,
  },

  getTitle: function (grip) {
    let title = "StyleSheet ";
    if (this.props.objectLink) {
      return DOM.span({className: "objectBox"},
        this.props.objectLink({
          object: grip
        }, title)
      );
    }
    return title;
  },

  getLocation: function (grip) {
    // Embedded stylesheets don't have URL and so, no preview.
    let url = grip.preview ? grip.preview.url : "";
    return url ? getURLDisplayString(url) : "";
  },

  render: function () {
    let grip = this.props.object;

    return (
      DOM.span({className: "objectBox objectBox-object"},
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

  return (type == "CSSStyleSheet");
}

module.exports = {
  rep: StyleSheet,
  supportsObject: supportsObject
};
