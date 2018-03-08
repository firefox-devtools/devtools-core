/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const {
  Component,
  createFactory,
} = require("react");
const dom = require("react-dom-factories");
const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");

import Components from "devtools-components";
const Tree = createFactory(Components.Tree);
require("./index.css");

const classnames = require("classnames");

const {
  REPS: {
    Rep,
    Grip,
  },
} = require("../reps/rep");
const {
  MODE,
} = require("../reps/constants");

const Utils = require("./utils");

const {
  getChildren,
  getClosestGripNode,
  getParent,
  getValue,
  nodeHasAccessors,
  nodeHasProperties,
  nodeIsBlock,
  nodeIsDefaultProperties,
  nodeIsFunction,
  nodeIsGetter,
  nodeIsMapEntry,
  nodeIsMissingArguments,
  nodeIsOptimizedOut,
  nodeIsPrimitive,
  nodeIsPrototype,
  nodeIsSetter,
  nodeIsUninitializedBinding,
  nodeIsUnmappedBinding,
  nodeIsUnscopedBinding,
  nodeIsWindow,
} = Utils.node;

import type {
  CachedNodes,
  Node,
  NodeContents,
  Props,
} from "./types";

type DefaultProps = {
  autoExpandAll: boolean,
  autoExpandDepth: number,
};

// This implements a component that renders an interactive inspector
// for looking at JavaScript objects. It expects descriptions of
// objects from the protocol, and will dynamically fetch children
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
  constructor(props: Props) {
    super();
    this.cachedNodes = new Map();

    const self: any = this;

    self.getItemChildren = this.getItemChildren.bind(this);
    self.renderTreeItem = this.renderTreeItem.bind(this);
    self.setExpanded = this.setExpanded.bind(this);
    self.focusItem = this.focusItem.bind(this);
    self.getRoots = this.getRoots.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    const {
      expandedPaths,
      loadedProperties,
      roots,
    } = this.props;

    if (roots !== nextProps.roots) {
      // Since the roots changed, we assume the properties did as well. Thus we can clear
      // the cachedNodes to avoid bugs and memory leaks.
      this.cachedNodes.clear();
      return true;
    }

    return expandedPaths.size !== nextProps.expandedPaths.size
      || loadedProperties.size !== nextProps.loadedProperties.size
      || [...expandedPaths].some(key => !nextProps.expandedPaths.has(key));
  }

  componentWillUnmount() {
    const { releaseActor } = this.props;
    if (typeof releaseActor !== "function") {
      return;
    }

    const { actors } = this.props;
    for (let actor of actors) {
      releaseActor(actor);
    }
  }

  props: Props;
  cachedNodes: CachedNodes;

  getItemChildren(item: Node) : Array<Node> | NodeContents | null {
    const {
      loadedProperties
    } = this.props;
    const { cachedNodes } = this;

    return getChildren({
      loadedProperties,
      cachedNodes,
      item
    });
  }

  getRoots(): Array<Node> {
    return this.props.roots;
  }

  getNodeKey(item: Node) : string {
    return item.path || JSON.stringify(item);
  }

  setExpanded(item: Node, expand: boolean) {
    if (nodeIsPrimitive(item)) {
      return;
    }

    const {
      createObjectClient,
      loadedProperties,
      nodeExpand,
      nodeCollapse,
      roots,
    } = this.props;

    if (expand === true) {
      const gripItem = getClosestGripNode(item);
      const value = getValue(gripItem);
      const isRoot = value && roots.some(root => {
        const rootValue = getValue(root);
        return rootValue && rootValue.actor === value.actor;
      });
      const actor = isRoot || !value ? null : value.actor;
      nodeExpand(item, actor, loadedProperties, createObjectClient);
    } else {
      nodeCollapse(item);
    }
  }

  focusItem(item: Node) {
    const {
      focusedItem,
      onFocus,
    } = this.props;

    if (focusedItem !== item && onFocus) {
      onFocus(item);
    }
  }

  getTreeItemLabelAndValue(item : Node, depth: number, expanded : boolean) : ({
    value?: string | Element,
    label?: string
  }) {
    let label = item.name;
    const isPrimitive = nodeIsPrimitive(item);

    if (nodeIsOptimizedOut(item)) {
      return {
        label,
        value: dom.span({ className: "unavailable" }, "(optimized away)")
      };
    }

    if (nodeIsUninitializedBinding(item)) {
      return {
        label,
        value: dom.span({ className: "unavailable" }, "(uninitialized)")
      };
    }

    if (nodeIsUnmappedBinding(item)) {
      return {
        label,
        value: dom.span({ className: "unavailable" }, "(unmapped)")
      };
    }

    if (nodeIsUnscopedBinding(item)) {
      return {
        label,
        value: dom.span({ className: "unavailable" }, "(unscoped)")
      };
    }

    if (nodeIsOptimizedOut(item)) {
      return {
        label,
        value: dom.span({ className: "unavailable" }, "(optimized away)")
      };
    }

    const itemValue = getValue(item);
    const unavailable =
      isPrimitive &&
      itemValue &&
      itemValue.hasOwnProperty &&
      itemValue.hasOwnProperty("unavailable");

    if (nodeIsMissingArguments(item) || unavailable) {
      return {
        label,
        value: dom.span({ className: "unavailable" }, "(unavailable)")
      };
    }

    if (
      nodeIsFunction(item)
      && !nodeIsGetter(item)
      && !nodeIsSetter(item)
      && (
        this.props.mode === MODE.TINY
        || !this.props.mode
      )
    ) {
      return {
        label: this.renderGrip(
          item,
          {
            ...this.props,
            functionName: label
          }
        )
      };
    }

    if (
      nodeHasProperties(item)
      || nodeHasAccessors(item)
      || nodeIsMapEntry(item)
      || isPrimitive
    ) {
      let repsProp = {...this.props};
      if (depth > 0) {
        repsProp.mode = this.props.mode === MODE.LONG
          ? MODE.SHORT
          : MODE.TINY;
      }
      if (expanded) {
        repsProp.mode = MODE.TINY;
      }

      return {
        label,
        value: this.renderGrip(item, repsProp)
      };
    }

    return {
      label,
    };
  }

  renderTreeItemLabel(
    label,
    item: Node,
    depth: number,
    focused: boolean,
    expanded: boolean
  ) {
    if (label === null || typeof label === "undefined") {
      return null;
    }

    const {
      onLabelClick,
    } = this.props;

    return dom.span({
      className: "object-label",
      onClick: onLabelClick
        ? event => {
          event.stopPropagation();

          // If the user selected text, bail out.
          if (Utils.selection.documentHasSelection()) {
            return;
          }

          onLabelClick(item, {
            depth,
            focused,
            expanded,
            setExpanded: this.setExpanded
          });
        }
        : undefined
    }, label);
  }

  getTreeTopElementProps(
    item: Node,
    depth: number,
    focused: boolean,
    expanded: boolean
  ) : Object {
    const {
      onDoubleClick,
      dimTopLevelWindow,
    } = this.props;

    let parentElementProps: Object = {
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
        ),
        block: nodeIsBlock(item)
      }),
      onClick: e => {
        e.stopPropagation();

        // If the user selected text, bail out.
        if (Utils.selection.documentHasSelection()) {
          return;
        }

        this.setExpanded(item, !expanded);
      },
    };

    if (onDoubleClick) {
      parentElementProps.onDoubleClick = e => {
        e.stopPropagation();
        onDoubleClick(item, {
          depth,
          focused,
          expanded
        });
      };
    }

    return parentElementProps;
  }

  renderTreeItem(
    item: Node,
    depth: number,
    focused: boolean,
    arrow: Object,
    expanded: boolean
  ) {
    const {label, value} = this.getTreeItemLabelAndValue(item, depth, expanded);
    const labelElement = this.renderTreeItemLabel(label, item, depth, focused, expanded);
    const delimiter = value && labelElement
      ? dom.span({ className: "object-delimiter" }, ": ")
      : null;

    return dom.div(
      this.getTreeTopElementProps(item, depth, focused, expanded),
      arrow,
      labelElement,
      delimiter,
      value
    );
  }

  renderGrip(
    item: Node,
    props: Props
  ) {
    const object = getValue(item);
    return Rep({
      ...props,
      object,
      mode: props.mode || MODE.TINY,
      defaultRep: Grip,
    });
  }

  render() {
    const {
      autoExpandAll = true,
      autoExpandDepth = 1,
      disabledFocus,
      disableWrap = false,
      expandedPaths,
      focusedItem,
      inline,
    } = this.props;

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
        "object-inspector": true,
      }),
      autoExpandAll,
      autoExpandDepth,
      disabledFocus,

      isExpanded: item => expandedPaths && expandedPaths.has(this.getNodeKey(item)),
      isExpandable: item => nodeIsPrimitive(item) === false,
      focused: focusedItem,

      getRoots: this.getRoots,
      getParent,
      getChildren: this.getItemChildren,
      getKey: this.getNodeKey,

      onExpand: item => this.setExpanded(item, true),
      onCollapse: item => this.setExpanded(item, false),
      onFocus: this.focusItem,

      renderItem: this.renderTreeItem
    });
  }
}

function mapStateToProps(state, props) {
  return {
    actors: state.actors,
    expandedPaths: state.expandedPaths,
    focusedItem: state.focusedItem,
    loadedProperties: state.loadedProperties,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(require("./actions"), dispatch);
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ObjectInspector);
