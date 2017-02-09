// ReactJS
const React = require("react");
// Dependencies
const {
  createFactories,
  isGrip,
  wrapRender,
} = require("./rep-utils");

const PropRep = React.createFactory(require("./prop-rep"));
const { MODE } = require("./constants");
// Shortcuts
const { span } = React.DOM;

/**
 * Renders a DOM Promise object.
 */
const PromiseRep = React.createClass({
  displayName: "Promise",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
    objectLink: React.PropTypes.func,
    attachedNodeFrontsByActor: React.PropTypes.object,
    onDOMNodeMouseOver: React.PropTypes.func,
    onDOMNodeMouseOut: React.PropTypes.func,
    onInspectIconClick: React.PropTypes.func,
  },

  getTitle: function (object) {
    const title = object.class;
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: object
      }, title);
    }
    return title;
  },

  getProps: function (promiseState) {
    const keys = ["state"];
    if (Object.keys(promiseState).includes("value")) {
      keys.push("value");
    }

    let {
      attachedNodeFrontsByActor,
      onDOMNodeMouseOver,
      onDOMNodeMouseOut,
      onInspectIconClick,
    } = this.props;

    return keys.map((key, i) => {
      let object = promiseState[key];
      return PropRep(Object.assign({}, this.props, {
        mode: MODE.TINY,
        name: `<${key}>`,
        object,
        equal: ": ",
        delim: i < keys.length - 1 ? ", " : "",
        attachedNodeFrontsByActor,
        onDOMNodeMouseOver,
        onDOMNodeMouseOut,
        onInspectIconClick,
      }));
    });
  },

  render: wrapRender(function () {
    const object = this.props.object;
    const {promiseState} = object;
    let objectLink = this.props.objectLink || span;

    if (this.props.mode === MODE.TINY) {
      let { Rep } = createFactories(require("./rep"));

      return (
        span({className: "objectBox objectBox-object"},
          this.getTitle(object),
          objectLink({
            className: "objectLeftBrace",
            object: object
          }, " { "),
          Rep({object: promiseState.state}),
          objectLink({
            className: "objectRightBrace",
            object: object
          }, " }")
        )
      );
    }

    const props = this.getProps(promiseState);
    return (
      span({className: "objectBox objectBox-object"},
        this.getTitle(object),
        objectLink({
          className: "objectLeftBrace",
          object: object
        }, " { "),
        ...props,
        objectLink({
          className: "objectRightBrace",
          object: object
        }, " }")
      )
    );
  }),
});

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return type === "Promise";
}

// Exports from this module
module.exports = {
  rep: PromiseRep,
  supportsObject: supportsObject
};
