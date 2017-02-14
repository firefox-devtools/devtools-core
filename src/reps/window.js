// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  getURLDisplayString,
  wrapRender
} = require("./rep-utils");

const { MODE } = require("./constants");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders a grip representing a window.
 */
let Window = React.createClass({
  displayName: "Window",

  propTypes: {
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
    object: React.PropTypes.object.isRequired,
    objectLink: React.PropTypes.func,
  },

  getTitle: function (object) {
    let title = object.displayClass || object.class || "Window";
    if (this.props.objectLink) {
      return DOM.span({className: "objectBox"},
        this.props.objectLink({
          object
        }, title)
      );
    }
    return title;
  },

  getLocation: function (object) {
    return getURLDisplayString(object.preview.url);
  },

  render: wrapRender(function () {
    let {
      mode,
      object,
    } = this.props;

    if (mode === MODE.TINY) {
      return (
        DOM.span({className: "objectBox objectBox-Window"},
          this.getTitle(object)
        )
      );
    }

    return (
      DOM.span({className: "objectBox objectBox-Window"},
        this.getTitle(object),
        " ",
        DOM.span({className: "objectPropValue"},
          this.getLocation(object)
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

  return (object.preview && type == "Window");
}

// Exports from this module
module.exports = {
  rep: Window,
  supportsObject: supportsObject
};
