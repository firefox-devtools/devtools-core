const React = require("react");

// Reps
const { isGrip } = require("./rep-utils");
const StringRep = require("./string");

// Shortcuts
const { span } = React.DOM;
const { rep: StringRepFactory } = React.createFactory(StringRep);

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
    let object = this.props.object;
    let value = object.preview.value;
    let objectLink = this.props.objectLink || span;

    return (
      objectLink({className: "objectLink-Attr", object},
        span({},
          span({className: "attrTitle"},
            this.getTitle(object)
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
