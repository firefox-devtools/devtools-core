// ReactJS
const React = require("react");

// Reps
const {
  isGrip,
  cropString,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
const Svg = require("./images/Svg");

// Shortcuts
const DOM = React.DOM;

/**
 * Renders DOM #text node.
 */
let TextNode = React.createClass({
  displayName: "TextNode",

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

  getTextContent: function (grip) {
    return cropString(grip.preview.textContent);
  },

  getTitle: function (grip) {
    const title = "#text";
    if (this.props.objectLink) {
      return this.props.objectLink({
        object: grip
      }, title);
    }
    return title;
  },

  render: wrapRender(function () {
    let {
      object: grip,
      mode = MODE.SHORT,
      attachedActorIds,
      onDOMNodeMouseOver,
      onDOMNodeMouseOut,
      onInspectIconClick,
    } = this.props;

    let baseConfig = {className: "objectBox objectBox-textNode"};
    let inspectIcon;
    let isInTree = attachedActorIds ? attachedActorIds.includes(grip.actor) : true;

    if (isInTree) {
      if (onDOMNodeMouseOver) {
        Object.assign(baseConfig, {
          onMouseOver: _ => onDOMNodeMouseOver(grip)
        });
      }

      if (onDOMNodeMouseOut) {
        Object.assign(baseConfig, {
          onMouseOut: onDOMNodeMouseOut
        });
      }

      if (onInspectIconClick) {
        inspectIcon = Svg("open-inspector", {
          element: "a",
          draggable: false,
          // TODO: Localize this with "openNodeInInspector" when Bug 1317038 lands
          title: "Click to select the node in the inspector",
          onClick: (e) => onInspectIconClick(grip, e)
        });
      }
    }

    if (mode === MODE.TINY) {
      return DOM.span(baseConfig, this.getTitle(grip), inspectIcon);
    }

    return (
      DOM.span(baseConfig,
        this.getTitle(grip),
        DOM.span({className: "nodeValue"},
          " ",
          `"${this.getTextContent(grip)}"`
        ),
        inspectIcon
      )
    );
  }),
});

// Registration

function supportsObject(grip, type) {
  if (!isGrip(grip)) {
    return false;
  }

  return (grip.preview && grip.class == "Text");
}

// Exports from this module
module.exports = {
  rep: TextNode,
  supportsObject: supportsObject
};
