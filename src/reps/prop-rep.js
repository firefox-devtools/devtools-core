// Dependencies
const React = require("react");
const {
  createFactories,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
// Shortcuts
const { span } = React.DOM;

/**
 * Property for Obj (local JS objects), Grip (remote JS objects)
 * and GripMap (remote JS maps and weakmaps) reps.
 * It's used to render object properties.
 */
let PropRep = React.createClass({
  displayName: "PropRep",

  propTypes: {
    // Property name.
    name: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]).isRequired,
    // Equal character rendered between property name and value.
    equal: React.PropTypes.string,
    // Delimiter character used to separate individual properties.
    delim: React.PropTypes.string,
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
    objectLink: React.PropTypes.func,
  },

  render: wrapRender(function () {
    const Grip = require("./grip");
    let { Rep } = createFactories(require("./rep"));

    let key;
    // The key can be a simple string, for plain objects,
    // or another object for maps and weakmaps.
    if (typeof this.props.name === "string") {
      key = span({"className": "nodeName"}, this.props.name);
    } else {
      key = Rep({
        object: this.props.name,
        mode: this.props.mode || MODE.TINY,
        defaultRep: Grip,
        objectLink: this.props.objectLink,
      });
    }

    return (
      span({},
        key,
        span({
          "className": "objectEqual"
        }, this.props.equal),
        Rep(this.props),
        span({
          "className": "objectComma"
        }, this.props.delim)
      )
    );
  })
});

// Exports from this module
module.exports = PropRep;
