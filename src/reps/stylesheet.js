// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  getURLDisplayString,
  wrapRender
} = require("./rep-utils");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders a grip representing CSSStyleSheet
 */
let StyleSheet = React.createClass({
  displayName: "object",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
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

  render: wrapRender(function () {
    let grip = this.props.object;

    return (
      DOM.span({className: "objectBox objectBox-object"},
        this.getTitle(grip),
        DOM.span({className: "objectPropValue"},
          this.getLocation(grip)
        )
      )
    );
  }),
});

// Registration

function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }

  return (type == "CSSStyleSheet");
}

// Exports from this module

module.exports = {
  rep: StyleSheet,
  supportsObject: supportsObject
};
