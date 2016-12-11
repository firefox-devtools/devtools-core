const React = require("react");

// Reps
const { isGrip, getURLDisplayString } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM document object.
 */
let Document = React.createClass({
  displayName: "Document",

  propTypes: {
    object: React.PropTypes.object.isRequired
  },

  getLocation: function (grip) {
    let location = grip.preview.location;
    return location ? getURLDisplayString(location) : "";
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return span({className: "objectBox"},
        this.props.objectLink({
          object: grip
        }, grip.class + " ")
      );
    }
    return "";
  },

  getTooltip: function (doc) {
    return doc.location.href;
  },

  render: function () {
    let grip = this.props.object;

    return (
      span({className: "objectBox objectBox-object"},
        this.getTitle(grip),
        span({className: "objectPropValue"},
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

  return (object.preview && type == "HTMLDocument");
}

module.exports = {
  rep: Document,
  supportsObject: supportsObject
};
