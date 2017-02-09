// ReactJS
const React = require("react");

// Utils
const {
  isGrip,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");
const nodeConstants = require("../shared/dom-node-constants");

// Shortcuts
const { a, span } = React.DOM;

/**
 * Renders DOM element node.
 */
const ElementNode = React.createClass({
  displayName: "ElementNode",

  propTypes: {
    object: React.PropTypes.object.isRequired,
    // @TODO Change this to Object.values once it's supported in Node's version of V8
    mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
    attachedNodeFrontsByActor: React.PropTypes.object,
    onDOMNodeMouseOver: React.PropTypes.func,
    onDOMNodeMouseOut: React.PropTypes.func,
    onInspectIconClick: React.PropTypes.func,
    objectLink: React.PropTypes.func,
  },

  getElements: function (grip, mode) {
    let {attributes, nodeName} = grip.preview;
    const nodeNameElement = span({
      className: "tag-name theme-fg-color3"
    }, nodeName);

    if (mode === MODE.TINY) {
      let elements = [nodeNameElement];
      if (attributes.id) {
        elements.push(
          span({className: "attr-name theme-fg-color2"}, `#${attributes.id}`));
      }
      if (attributes.class) {
        elements.push(
          span({className: "attr-name theme-fg-color2"},
            attributes.class
              .replace(/(^\s+)|(\s+$)/g, "")
              .split(" ")
              .map(cls => `.${cls}`)
              .join("")
          )
        );
      }
      return elements;
    }
    let attributeElements = Object.keys(attributes)
      .sort(function getIdAndClassFirst(a1, a2) {
        if ([a1, a2].includes("id")) {
          return 3 * (a1 === "id" ? -1 : 1);
        }
        if ([a1, a2].includes("class")) {
          return 2 * (a1 === "class" ? -1 : 1);
        }

        // `id` and `class` excepted,
        // we want to keep the same order that in `attributes`.
        return 0;
      })
      .reduce((arr, name, i, keys) => {
        let value = attributes[name];
        let attribute = span({},
          span({className: "attr-name theme-fg-color2"}, `${name}`),
          `="`,
          span({className: "attr-value theme-fg-color6"}, `${value}`),
          `"`
        );

        return arr.concat([" ", attribute]);
      }, []);

    return [
      "<",
      nodeNameElement,
      ...attributeElements,
      ">",
    ];
  },

  render: wrapRender(function () {
    let {
      object,
      mode,
      attachedNodeFrontsByActor,
      onDOMNodeMouseOver,
      onDOMNodeMouseOut,
      onInspectIconClick,
    } = this.props;
    let elements = this.getElements(object, mode);
    let objectLink = this.props.objectLink || span;
    let attachedNodeFront = attachedNodeFrontsByActor
      ? attachedNodeFrontsByActor[object.actor]
      : null;

    let baseConfig = {className: "objectBox objectBox-node"};
    let inspectIcon;
    if (attachedNodeFront) {
      if (onDOMNodeMouseOver) {
        Object.assign(baseConfig, {
          onMouseOver: _ => onDOMNodeMouseOver(attachedNodeFront)
        });
      }

      if (onDOMNodeMouseOut) {
        Object.assign(baseConfig, {
          onMouseOut: onDOMNodeMouseOut
        });
      }

      if (onInspectIconClick) {
        inspectIcon = a({
          className: "open-inspector",
          draggable: false,
          // TODO: Localize this with "openNodeInInspector" when Bug 1317038 lands
          title: "Click to select the node in the inspector",
          onClick: () => onInspectIconClick(attachedNodeFront)
        });
      }
    }

    return span(baseConfig,
      objectLink({object}, ...elements),
      inspectIcon
    );
  }),
});

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return object.preview && object.preview.nodeType === nodeConstants.ELEMENT_NODE;
}

// Exports from this module
module.exports = {
  rep: ElementNode,
  supportsObject: supportsObject
};
