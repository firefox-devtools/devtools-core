// ReactJS
const React = require("react");

// Reps
const {
  createFactories,
  isGrip,
  wrapRender,
} = require("./rep-utils");

const { rep } = createFactories(require("./grip"));
const { MODE } = require("./constants");

/**
 * Renders DOM event objects.
 */
let Event = React.createClass({
  displayName: "event",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
    attachedActorIds: React.PropTypes.array,
    onDOMNodeMouseOver: React.PropTypes.func,
    onDOMNodeMouseOut: React.PropTypes.func,
    onInspectIconClick: React.PropTypes.func,
  },

  getTitle: function (props) {
    let preview = props.object.preview;
    let title = preview.type;

    if (preview.eventKind == "key" && preview.modifiers && preview.modifiers.length) {
      title = `${title} ${preview.modifiers.join("-")}`;
    }
    return title;
  },

  render: wrapRender(function () {
    // Use `Object.assign` to keep `this.props` without changes because:
    // 1. JSON.stringify/JSON.parse is slow.
    // 2. Immutable.js is planned for the future.
    let gripProps = Object.assign({}, this.props, {
      title: this.getTitle(this.props)
    });
    gripProps.object = Object.assign({}, this.props.object);
    gripProps.object.preview = Object.assign({}, this.props.object.preview);

    gripProps.object.preview.ownProperties = {};
    if (gripProps.object.preview.target) {
      Object.assign(gripProps.object.preview.ownProperties, {
        target: gripProps.object.preview.target
      });
    }
    Object.assign(gripProps.object.preview.ownProperties,
      gripProps.object.preview.properties);

    delete gripProps.object.preview.properties;
    gripProps.object.ownPropertyLength =
      Object.keys(gripProps.object.preview.ownProperties).length;

    switch (gripProps.object.class) {
      case "MouseEvent":
        gripProps.isInterestingProp = (type, value, name) => {
          return ["target", "clientX", "clientY", "layerX", "layerY"].includes(name);
        };
        break;
      case "KeyboardEvent":
        gripProps.isInterestingProp = (type, value, name) => {
          return ["target", "key", "charCode", "keyCode"].includes(name);
        };
        break;
      case "MessageEvent":
        gripProps.isInterestingProp = (type, value, name) => {
          return ["target", "isTrusted", "data"].includes(name);
        };
        break;
      default:
        gripProps.isInterestingProp = (type, value, name) => {
          // We want to show the properties in the order they are declared.
          return Object.keys(gripProps.object.preview.ownProperties).includes(name);
        };
    }

    return rep(gripProps);
  })
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.preview.kind == "DOMEvent");
}

// Exports from this module
module.exports = {
  rep: Event,
  supportsObject: supportsObject
};
