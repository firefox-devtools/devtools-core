
const React = require("react");

// Reps
const { isGrip, getURLDisplayString } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a grip object with URL data.
 */
let ObjectWithURL = React.createClass({
  displayName: "ObjectWithURL",

  propTypes: {
    object: React.PropTypes.object.isRequired,
  },

  getTitle: function (grip) {
    if (this.props.objectLink) {
      return span({className: "objectBox"},
        this.props.objectLink({
          object: grip
        }, this.getType(grip) + " ")
      );
    }
    return "";
  },

  getType: function (grip) {
    return grip.class;
  },

  getDescription: function (grip) {
    return getURLDisplayString(grip.preview.url);
  },

  render: function () {
    let grip = this.props.object;
    return (
      span({className: "objectBox objectBox-" + this.getType(grip)},
        this.getTitle(grip),
        span({className: "objectPropValue"},
          this.getDescription(grip)
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

  return (grip.preview && grip.preview.kind == "ObjectWithURL");
}

module.exports = {
  rep: ObjectWithURL,
  supportsObject: supportsObject
};
