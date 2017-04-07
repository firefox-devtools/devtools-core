// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  getURLDisplayString,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");

// Shortcuts
const { span } = React.DOM;

/**
 * Renders DOM document object.
 */
Document.propTypes = {
  object: React.PropTypes.object.isRequired,
  objectLink: React.PropTypes.func,
};

function Document(props) {
  let grip = props.object;

  return (
    span({className: "objectBox objectBox-object"},
      getTitle(props, grip),
      span({className: "objectPropValue"},
        getLocation(grip)
      )
    )
  );
}

function getLocation(grip) {
  let location = grip.preview.location;
  return location ? getURLDisplayString(location) : "";
}

function getTitle(props, grip) {
  return safeObjectLink(props, {}, grip.class + " ");
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }

  return (object.preview && type == "HTMLDocument");
}

// Exports from this module
module.exports = {
  rep: wrapRender(Document),
  supportsObject,
};
