// Dependencies
const React = require("react");
const {
  maybeEscapePropertyName,
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
PropRep.propTypes = {
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
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
  // Normally a PropRep will quote a property name that isn't valid
  // when unquoted; but this flag can be used to suppress the
  // quoting.
  suppressQuotes: React.PropTypes.bool,
};

function PropRep(props) {
  const Grip = require("./grip");
  const { Rep } = require("./rep");

  let {
    name,
    mode,
    equal,
    delim,
    suppressQuotes,
  } = props;

  let key;
  // The key can be a simple string, for plain objects,
  // or another object for maps and weakmaps.
  if (typeof name === "string") {
    if (!suppressQuotes) {
      name = maybeEscapePropertyName(name);
    }
    key = span({"className": "nodeName"}, name);
  } else {
    key = Rep(Object.assign({}, props, {
      object: name,
      mode: mode || MODE.TINY,
      defaultRep: Grip,
    }));
  }

  return (
    span({},
      key,
      span({
        "className": "objectEqual"
      }, equal),
      Rep(Object.assign({}, props)),
      span({
        "className": "objectComma"
      }, delim)
    )
  );
}

// Exports from this module
module.exports = wrapRender(PropRep);
