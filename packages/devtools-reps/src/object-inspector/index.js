/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const {
  Component,
  createFactory,
  DOM: dom,
  PropTypes,
} = require("react");

import Components from "devtools-components";
const Tree = createFactory(Components.Tree);
require("./index.css");

const classnames = require("classnames");
const Svg = require("../shared/images/Svg");
const {
  REPS: {
    Rep,
    Grip,
  },
} = require("../reps/rep");
const {
  MODE,
} = require("../reps/constants");

const {
  getChildren,
  getParent,
  getValue,
  nodeHasAccessors,
  nodeHasAllEntriesInPreview,
  nodeHasProperties,
  nodeIsDefaultProperties,
  nodeIsEntries,
  nodeIsGetter,
  nodeIsMapEntry,
  nodeIsFunction,
  nodeIsMissingArguments,
  nodeIsOptimizedOut,
  nodeIsPrimitive,
  nodeIsPrototype,
  nodeIsProxy,
  nodeIsSetter,
  nodeIsWindow,
} = require("./utils");

import type {
  LoadedEntries,
  LoadedProperties,
  Node,
  NodeContents,
  RdpGrip,
} from "./types";

type Mode = MODE.TINY | MODE.SHORT | MODE.LONG;

type Props = {
  autoExpandAll: boolean,
  autoExpandDepth: number,
  disabledFocus: boolean,
  itemHeight: number,
  inline: boolean,
  mode: Mode,
  roots: Array<Node>,
  disableWrap: boolean,
  dimTopLevelWindow: boolean,
  getObjectEntries: (actor:string) => ?LoadedEntries,
  getObjectProperties: (actor:string) => ?LoadedProperties,
  loadObjectEntries: (value:RdpGrip) => void,
  loadObjectProperties: (value:RdpGrip) => void,
  onFocus: ?(Node) => any,
  onDoubleClick: ?(
    item: Node,
    options: {
      depth: number,
      focused: boolean,
      expanded: boolean
    }
  ) => any,
  onLabelClick: ?(
    item: Node,
    options: {
      depth: number,
      focused: boolean,
      expanded: boolean,
      setExpanded: (Node, boolean) => any,
    }
  ) => any,
};

type State = {
  expandedKeys: any,
  focusedItem: ?Node
};

type DefaultProps = {
  autoExpandAll: boolean,
  autoExpandDepth: number,
};

// This implements a component that renders an interactive inspector
// for looking at JavaScript objects. It expects descriptions of
// objects from the protocol, and will dynamically fetch child
// properties as objects are expanded.
//
// If you want to inspect a single object, pass the name and the
// protocol descriptor of it:
//
//  ObjectInspector({
//    name: "foo",
//    desc: { writable: true, ..., { value: { actor: "1", ... }}},
//    ...
//  })
//
// If you want multiple top-level objects (like scopes), you can pass
// an array of manually constructed nodes as `roots`:
//
//  ObjectInspector({
//    roots: [{ name: ... }, ...],
//    ...
//  });

// There are 3 types of nodes: a simple node with a children array, an
// object that has properties that should be children when they are
// fetched, and a primitive value that should be displayed with no
// children.

class ObjectInspector extends Component {
  static defaultProps: DefaultProps;
  constructor() {
    super();

    this.actors = {};
    this.state = {
      expandedKeys: new Set(),
      focusedItem: null
    };

    const self: any = this;

    self.getChildren = this.getChildren.bind(this);
    self.renderTreeItem = this.renderTreeItem.bind(this);
    self.setExpanded = this.setExpanded.bind(this);
    self.focusItem = this.focusItem.bind(this);
    self.getRoots = this.getRoots.bind(this);
  }

  state: State;
  props: Props;
  actors: any;

  getChildren(item: Node)
    : Array<Node> | NodeContents | null {
    const {
      getObjectEntries,
      getObjectProperties,
    } = this.props;
    const { actors } = this;

    return getChildren({
      getObjectEntries,
      getObjectProperties,
      actors,
      item
    });
  }

  getRoots(): Array<Node> {
    return this.props.roots;
  }

  getKey(item: Node) : string {
    return item.path;
  }

  setExpanded(item: Node, expand: boolean) {
    const { expandedKeys } = this.state;
    const key = this.getKey(item);

    if (expand === true) {
      expandedKeys.add(key);
    } else {
      expandedKeys.delete(key);
    }

    this.setState({ expandedKeys });

    if (expand === true) {
      const {
        loadObjectProperties,
        loadObjectEntries,
      } = this.props;

      if (this.shouldLoadItemProperties(item)) {
        const value = getValue(item);
        loadObjectProperties(value);
      }

      if (this.shouldLoadItemEntries(item)) {
        const parent = getParent(item);
        const parentValue = getValue(parent);
        loadObjectEntries(parentValue);
      }
    }
  }

  shouldLoadItemProperties(item: Node) : boolean {
    const value = getValue(item);
    const {
      getObjectProperties
    } = this.props;

    return nodeHasProperties(item)
      && value
      && !getObjectProperties(value.actor)
      && !nodeIsProxy(item);
  }

  shouldLoadItemEntries(item: Node) : boolean {
    const parent = getParent(item);
    const parentValue = getValue(parent);
    const parentActor = parentValue
      ? parentValue.actor
      : null;

    const {
      getObjectEntries
    } = this.props;

    return nodeIsEntries(item)
      && !nodeHasAllEntriesInPreview(parent)
      && !!parentActor
      && !getObjectEntries(parentActor);
  }

  focusItem(item: Node) {
    if (!this.props.disabledFocus && this.state.focusedItem !== item) {
      this.setState({
        focusedItem: item
      });

      if (this.props.onFocus) {
        this.props.onFocus(item);
      }
    }
  }

  renderTreeItem(
    item: Node,
    depth: number,
    focused: boolean,
    arrow: Object,
    expanded: boolean
  ) {
    let objectValue;
    let label = item.name;
    let itemValue = getValue(item);

    const isPrimitive = nodeIsPrimitive(item);

    const unavailable =
      isPrimitive &&
      itemValue &&
      itemValue.hasOwnProperty &&
      itemValue.hasOwnProperty("unavailable");

    if (nodeIsOptimizedOut(item)) {
      objectValue = dom.span({ className: "unavailable" }, "(optimized away)");
    } else if (nodeIsMissingArguments(item) || unavailable) {
      objectValue = dom.span({ className: "unavailable" }, "(unavailable)");
    } else if (
      nodeIsFunction(item)
      && !nodeIsGetter(item)
      && !nodeIsSetter(item)
      && (
        this.props.mode === MODE.TINY
        || !this.props.mode
      )
    ) {
      objectValue = undefined;
      label = this.renderGrip(
        item,
        Object.assign({}, this.props, {
          functionName: label
        })
      );
    } else if (
      nodeHasProperties(item)
      || nodeHasAccessors(item)
      || nodeIsMapEntry(item)
      || isPrimitive
    ) {
      let repsProp = Object.assign({}, this.props);
      if (depth > 0) {
        repsProp.mode = this.props.mode === MODE.LONG
          ? MODE.SHORT
          : MODE.TINY;
      }

      objectValue = this.renderGrip(item, repsProp);
    }

    const hasLabel = label !== null && typeof label !== "undefined";
    const hasValue = typeof objectValue !== "undefined";

    const SINGLE_INDENT_WIDTH = 15;
    const indentWidth = (depth + (isPrimitive ? 1 : 0)) * SINGLE_INDENT_WIDTH;

    const {
      onDoubleClick,
      onLabelClick,
      dimTopLevelWindow,
    } = this.props;

    return dom.div(
      {
        className: classnames("node object-node", {
          focused,
          lessen: !expanded && (
            nodeIsDefaultProperties(item)
            || nodeIsPrototype(item)
            || (
                dimTopLevelWindow === true
                && nodeIsWindow(item)
                && depth === 0
              )
          )
        }),
        style: {
          marginLeft: indentWidth
        },
        onClick: isPrimitive === false
          ? e => {
            e.stopPropagation();
            this.setExpanded(item, !expanded);
          }
          : null,
        onDoubleClick: onDoubleClick
          ? e => {
            e.stopPropagation();
            onDoubleClick(item, {
              depth,
              focused,
              expanded
            });
          }
          : null
      },
      isPrimitive === false
        ? Svg("arrow", {
          className: classnames({
            expanded: expanded
          })
        })
        : null,
      hasLabel
        ? dom.span(
          {
            className: "object-label",
            onClick: onLabelClick
              ? event => {
                event.stopPropagation();
                onLabelClick(item, {
                  depth,
                  focused,
                  expanded,
                  setExpanded: this.setExpanded
                });
              }
              : null
          },
          label
        )
        : null,
      hasLabel && hasValue
        ? dom.span({ className: "object-delimiter" }, " : ")
        : null,
      hasValue
        ? objectValue
        : null
    );
  }

  renderGrip(
    item: Node,
    props: Props
  ) {
    const object = getValue(item);
    return Rep(Object.assign({}, props, {
      object,
      mode: props.mode || MODE.TINY,
      defaultRep: Grip,
    }));
  }

  render() {
    const {
      autoExpandDepth = 1,
      autoExpandAll = true,
      disabledFocus,
      inline,
      itemHeight = 20,
      disableWrap = false,
    } = this.props;

    const {
      expandedKeys,
      focusedItem,
    } = this.state;

    let roots = this.getRoots();
    if (roots.length === 1) {
      const root = roots[0];
      const name = root && root.name;
      if (nodeIsPrimitive(root) && (name === null || typeof name === "undefined")) {
        return this.renderGrip(root, this.props);
      }
    }

    return Tree({
      className: classnames({
        inline,
        nowrap: disableWrap,
      }),
      autoExpandAll,
      autoExpandDepth,
      disabledFocus,
      itemHeight,

      isExpanded: item => expandedKeys.has(this.getKey(item)),
      focused: focusedItem,

      getRoots: this.getRoots,
      getParent,
      getChildren: this.getChildren,
      getKey: this.getKey,

      onExpand: item => this.setExpanded(item, true),
      onCollapse: item => this.setExpanded(item, false),
      onFocus: this.focusItem,

      renderItem: this.renderTreeItem
    });
  }
}

ObjectInspector.displayName = "ObjectInspector";

ObjectInspector.propTypes = {
  autoExpandAll: PropTypes.bool,
  autoExpandDepth: PropTypes.number,
  disabledFocus: PropTypes.bool,
  disableWrap: PropTypes.bool,
  inline: PropTypes.bool,
  roots: PropTypes.array,
  getObjectProperties: PropTypes.func.isRequired,
  loadObjectProperties: PropTypes.func.isRequired,
  itemHeight: PropTypes.number,
  mode: PropTypes.oneOf(Object.values(MODE)),
  onFocus: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onLabelClick: PropTypes.func,
};

module.exports = ObjectInspector;
