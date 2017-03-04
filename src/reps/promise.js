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
    attachedActorIds: React.PropTypes.array,
    onDOMNodeMouseOver: React.PropTypes.func,
    onDOMNodeMouseOut: React.PropTypes.func,
    onInspectIconClick: React.PropTypes.func,
  },

  getTitle: function (object) {
    const title = object.class;
    return this.safeObjectLink({}, title);
  },

  getProps: function (promiseState) {
    const keys = ["state"];
    if (Object.keys(promiseState).includes("value")) {
      keys.push("value");
    }

    return keys.map((key, i) => {
      let object = promiseState[key];
      return PropRep(Object.assign({}, this.props, {
        mode: MODE.TINY,
        name: `<${key}>`,
        object,
        equal: ": ",
        delim: i < keys.length - 1 ? ", " : "",
        suppressQuotes: true,
      }));
    });
  },

  safeObjectLink: function (config, ...children) {
    if (this.props.objectLink) {
      return this.props.objectLink(Object.assign({
        object: this.props.object
      }, config), ...children);
    }

    if (Object.keys(config).length === 0 && children.length === 1) {
      return children[0];
    }

    return span(config, ...children);
  },

  render: wrapRender(function () {
    const object = this.props.object;
    const {promiseState} = object;

    if (this.props.mode === MODE.TINY) {
      let { Rep } = createFactories(require("./rep"));

      return (
        span({className: "objectBox objectBox-object"},
          this.getTitle(object),
          this.safeObjectLink({
            className: "objectLeftBrace",
          }, " { "),
          Rep({object: promiseState.state}),
          this.safeObjectLink({
            className: "objectRightBrace",
          }, " }")
        )
      );
    }

    const propsArray = this.getProps(promiseState);
    return (
      span({className: "objectBox objectBox-object"},
        this.getTitle(object),
        this.safeObjectLink({
          className: "objectLeftBrace",
        }, " { "),
        ...propsArray,
        this.safeObjectLink({
          className: "objectRightBrace",
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
