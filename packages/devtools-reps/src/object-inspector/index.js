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

const Tree = createFactory(require("devtools-components").Tree);
require("./index.css");

const classnames = require("classnames");
const Svg = require("../shared/images/Svg");
const {
  REPS: { Rep },
} = require("../reps/rep");
const {
  MODE,
} = require("../reps/constants");

const {
  getChildren,
  getParent,
  getValue,
  nodeIsDefault,
  nodeHasAccessors,
  nodeHasProperties,
  nodeIsMissingArguments,
  nodeIsOptimizedOut,
  nodeIsPrimitive,
} = require("./utils");

import type {
  ObjectInspectorItemContentsValue,
  ObjectInspectorItemContents,
  ObjectInspectorItem,
} from "./types";

type Mode = MODE.TINY | MODE.SHORT | MODE.LONG;

type Props = {
  autoExpandAll: boolean,
  autoExpandDepth: number,
  disabledFocus: boolean,
  itemHeight: number,
  mode: Mode,
  roots: Array<ObjectInspectorItem>,
  disableWrap: boolean,
  getObjectProperties: (actor:string) => any,
  loadObjectProperties: (value:ObjectInspectorItemContentsValue) => any,
  onFocus: ?(ObjectInspectorItem) => any,
  onDoubleClick: ?(
    item: ObjectInspectorItem,
    options: {
      depth: number,
      focused: boolean,
      expanded: boolean
    }
  ) => any,
  onLabelClick: ?(
    item: ObjectInspectorItem,
    options: {
      depth: number,
      focused: boolean,
      expanded: boolean,
      setExpanded: (ObjectInspectorItem, boolean) => any,
    }
  ) => any,
};

type State = {
  expandedKeys: any,
  focusedItem: ?ObjectInspectorItem
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

  isDefaultProperty(item: ObjectInspectorItem) {
    const roots = this.props.roots;
    return nodeIsDefault(item, roots);
  }

  getChildren(item: ObjectInspectorItem)
    : Array<ObjectInspectorItem> | ObjectInspectorItemContents | null {
    const { getObjectProperties } = this.props;
    const { actors } = this;

    return getChildren({
      getObjectProperties,
      actors,
      item
    });
  }

  getRoots(): Array<ObjectInspectorItem> {
    return this.props.roots;
  }

  getKey(item: ObjectInspectorItem) : string {
    return item.path;
  }

  setExpanded(item: ObjectInspectorItem, expand: boolean) {
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
        getObjectProperties,
        loadObjectProperties,
      } = this.props;

      const value = getValue(item);
      if (nodeHasProperties(item) && value && !getObjectProperties(value.actor)) {
        loadObjectProperties(value);
      }
    }
  }

  focusItem(item: ObjectInspectorItem) {
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
    item: ObjectInspectorItem,
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
    } else if (nodeHasProperties(item) || nodeHasAccessors(item) || isPrimitive) {
      let repsProp = Object.assign({}, this.props);
      if (depth > 0) {
        repsProp.mode = this.props.mode === MODE.LONG
          ? MODE.SHORT
          : MODE.TINY;
      }

      objectValue = this.renderGrip(item, repsProp);
    }

    const SINGLE_INDENT_WIDTH = 15;
    const indentWidth = (depth + (isPrimitive ? 1 : 0)) * SINGLE_INDENT_WIDTH;

    const {
      onDoubleClick,
      onLabelClick,
    } = this.props;

    return dom.div(
      {
        className: classnames("node object-node", {
          focused,
          "default-property": this.isDefaultProperty(item)
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
      label
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
      label && objectValue
        ? dom.span({ className: "object-delimiter" }, " : ")
        : null,
      objectValue
    );
  }

  renderGrip(
    item: ObjectInspectorItem,
    props: Props
  ) {
    const object = getValue(item);
    return Rep(Object.assign({}, props, {
      object,
      mode: props.mode || MODE.TINY
    }));
  }

  render() {
    const {
      autoExpandDepth = 1,
      autoExpandAll = true,
      disabledFocus,
      itemHeight = 20,
      disableWrap = false,
    } = this.props;

    const {
      expandedKeys,
      focusedItem,
    } = this.state;

    let roots = this.getRoots();
    if (roots.length === 1 && nodeIsPrimitive(roots[0])) {
      return this.renderGrip(roots[0], this.props);
    }

    return Tree({
      className: disableWrap ? "nowrap" : "",
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
