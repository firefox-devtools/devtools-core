const React = require("react");

// Reps
const { createFactories, isGrip } = require("./rep-utils");
const { StringRep } = require("./string");

// Shortcuts
const { span } = React.DOM;
const { rep: StringRepFactory } = createFactories(StringRep);

/**
 * Renders DOM attribute
 */
let Attribute = React.createClass({
  displayName: "Attr",

  propTypes: {
    object: React.PropTypes.object.isRequired
  },

  getTitle: function (grip) {
    return grip.preview.nodeName;
  },

  render: function () {
    let grip = this.props.object;
    let value = grip.preview.value;
    let objectLink = this.props.objectLink || span;

    return (
      objectLink({className: "objectLink-Attr"},
        span({},
          span({className: "attrTitle"},
            this.getTitle(grip)
          ),
          span({className: "attrEqual"},
            "="
          ),
          StringRepFactory({object: value})
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

  return (type == "Attr" && grip.preview);
}

module.exports = {
  rep: Attribute,
  supportsObject: supportsObject
};
