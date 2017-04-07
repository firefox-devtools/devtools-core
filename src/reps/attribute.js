// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const {rep: StringRep} = require("./string");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM attribute
 */
Attribute.propTypes = {
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
};

function Attribute(props) {
  let {
    object,
  } = props;
  let value = object.preview.value;

  return (
    safeObjectLink(props, {className: "objectLink-Attr"},
      span({className: "attrTitle"},
        getTitle(object)
      ),
      span({className: "attrEqual"},
        "="
      ),
      StringRep({object: value})
    )
  );
}

function getTitle(grip) {
  return grip.preview.nodeName;
}

// Registration
function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (type == "Attr" && grip.preview);
}

module.exports = {
  rep: wrapRender(Attribute),
  supportsObject,
};
