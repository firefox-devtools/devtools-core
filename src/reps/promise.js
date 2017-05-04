// ReactJS
const React = require("react");
// Dependencies
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");

const PropRep = require("./prop-rep");
const { MODE } = require("./constants");
// Shortcuts
const { span } = React.DOM;

/**
 * Renders a DOM Promise object.
 */
PromiseRep.propTypes = {
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  objectLink: React.PropTypes.func,
  onDOMNodeMouseOver: React.PropTypes.func,
  onDOMNodeMouseOut: React.PropTypes.func,
  onInspectIconClick: React.PropTypes.func,
};

function PromiseRep(props) {
  const object = props.object;
  const {promiseState} = object;

  if (props.mode === MODE.TINY) {
    let { Rep } = require("./rep");

    return (
      span({className: "objectBox objectBox-object"},
        getTitle(props, object),
        safeObjectLink(props, {
          className: "objectLeftBrace",
        }, " { "),
        Rep({object: promiseState.state}),
        safeObjectLink(props, {
          className: "objectRightBrace",
        }, " }")
      )
    );
  }

  const propsArray = getProps(props, promiseState);
  return (
    span({className: "objectBox objectBox-object"},
      getTitle(props, object),
      safeObjectLink(props, {
        className: "objectLeftBrace",
      }, " { "),
      ...propsArray,
      safeObjectLink(props, {
        className: "objectRightBrace",
      }, " }")
    )
  );
}

function getTitle(props, object) {
  const title = object.class;
  return safeObjectLink(props, {}, title);
}

function getProps(props, promiseState) {
  const keys = ["state"];
  if (Object.keys(promiseState).includes("value")) {
    keys.push("value");
  }

  return keys.reduce((res, key, i) => {
    let object = promiseState[key];
    res = res.concat(PropRep(Object.assign({}, props, {
      mode: MODE.TINY,
      name: `<${key}>`,
      object,
      equal: ": ",
      suppressQuotes: true,
    })));

    // Interleave commas between elements
    if (i !== keys.length - 1) {
      res.push(", ");
    }

    return res;
  }, []);
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return type === "Promise";
}

// Exports from this module
module.exports = {
  rep: wrapRender(PromiseRep),
  supportsObject,
};
