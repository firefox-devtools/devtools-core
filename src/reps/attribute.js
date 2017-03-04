// ReactJS
const React = require("react");

// Reps
const {
  createFactories,
  isGrip,
  wrapRender,
} = require("./rep-utils");
const StringRep = require("./string");

// Shortcuts
const { span } = React.DOM;
const { rep: StringRepFactory } = createFactories(StringRep);

/**
 * Renders DOM attribute
 */
let Attribute = React.createClass({
  displayName: "Attr",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
  },

  getTitle: function (grip) {
    return grip.preview.nodeName;
  },

  render: wrapRender(function () {
    let object = this.props.object;
    let value = object.preview.value;
    let objectLink = (config, ...children) => {
      if (this.props.objectLink) {
        return this.props.objectLink(Object.assign({object}, config), ...children);
      }
      return span(config, ...children);
    };

    return (
      objectLink({className: "objectLink-Attr"},
        span({className: "attrTitle"},
          this.getTitle(object)
        ),
        span({className: "attrEqual"},
          "="
        ),
        StringRepFactory({object: value})
      )
    );
  }),
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
