
const React = require("devtools/client/shared/vendor/react");

// Reps
const { isGrip } = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders a grip object with textual data.
 */
let ObjectWithText = React.createClass({
  displayName: "ObjectWithText",

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
    return "\"" + grip.preview.text + "\"";
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

  return (grip.preview && grip.preview.kind == "ObjectWithText");
}

module.exports = {
  rep: ObjectWithText,
  supportsObject: supportsObject
};
