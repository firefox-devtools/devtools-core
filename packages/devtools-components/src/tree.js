/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
const { DOM: dom, createClass, createFactory, createElement, PropTypes } = React;
import InlineSVG from "svg-inline-react";
import svgArrow from "./images/arrow.svg";

require("./tree.css");

const AUTO_EXPAND_DEPTH = 0; // depth

/**
 * An arrow that displays whether its node is expanded (▼) or collapsed
 * (▶). When its node has no children, it is hidden.
 */
const ArrowExpander = createFactory(createClass({
  displayName: "ArrowExpander",

  propTypes: {
    expanded: PropTypes.bool,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.expanded !== nextProps.expanded;
  },

  render() {
    const {
      expanded,
    } = this.props;

    const classNames = ["arrow"];
    if (expanded) {
      classNames.push("expanded");
    }
    return createElement(InlineSVG, {
      className: classNames.join(" "),
      src: svgArrow
    });
  }
}));

const TreeNode = createFactory(createClass({
  displayName: "TreeNode",

  propTypes: {
    id: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    depth: PropTypes.number.isRequired,
    focused: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    item: PropTypes.any.isRequired,
    isExpandable: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    renderItem: PropTypes.func.isRequired,
  },

  shouldComponentUpdate(nextProps) {
    return this.props.item !== nextProps.item ||
      this.props.focused !== nextProps.focused ||
      this.props.expanded !== nextProps.expanded;
  },

  render() {
    const {
      depth,
      id,
      item,
      focused,
      expanded,
      renderItem,
      isExpandable,
    } = this.props;

    const arrow = isExpandable
      ? ArrowExpander({
        item,
        expanded,
      })
      : null;

    const treeIndentWidthVar = "var(--tree-indent-width)";
    const treeBorderColorVar = "var(--tree-indent-border-color, black)";
    const treeBorderWidthVar = "var(--tree-indent-border-width, 1px)";

    const paddingInlineStart = `calc(
      (${treeIndentWidthVar} * ${depth})
      ${(isExpandable ? "" : "+ var(--arrow-total-width)")}
    )`;

    // This is the computed border that will mimic a border on tree nodes.
    // This allow us to have as many "borders" as we need without adding
    // specific elements for that purpose only.
    // it's a gradient with "hard stops" which will give us as much plain
    // lines as we need given the depth of the node.
    // The gradient uses CSS custom properties so everything is customizable
    // by consumers if needed.
    const backgroundBorder = depth === 0
      ? null
      : "linear-gradient(90deg, " +
          Array.from({length: depth}).map((_, i) => {
            const indentWidth = `(${i} * ${treeIndentWidthVar})`;
            const alignIndent = `(var(--arrow-width) / 2)`;
            const start = `calc(${indentWidth} + ${alignIndent})`;
            const end = `calc(${indentWidth} + ${alignIndent} + ${treeBorderWidthVar})`;

            return `transparent ${start},
              ${treeBorderColorVar} ${start},
              ${treeBorderColorVar} ${end},
              transparent ${end}`;
          }).join(",") +
        ")";

    let ariaExpanded;
    if (this.props.isExpandable) {
      ariaExpanded = false;
    }
    if (this.props.expanded) {
      ariaExpanded = true;
    }

    return dom.div(
      {
        id,
        className: "tree-node" + (focused ? " focused" : ""),
        style: {
          paddingInlineStart,
          backgroundImage: backgroundBorder,
        },
        onClick: this.props.onClick,
        role: "treeitem",
        "aria-level": depth,
        "aria-expanded": ariaExpanded,
        "data-expandable": this.props.isExpandable,
      },
      renderItem(item, depth, focused, arrow, expanded)
    );
  }
}));

/**
 * Create a function that calls the given function `fn` only once per animation
 * frame.
 *
 * @param {Function} fn
 * @returns {Function}
 */
function oncePerAnimationFrame(fn) {
  let animationId = null;
  let argsToPass = null;
  return function (...args) {
    argsToPass = args;
    if (animationId !== null) {
      return;
    }

    animationId = requestAnimationFrame(() => {
      fn.call(this, ...argsToPass);
      animationId = null;
      argsToPass = null;
    });
  };
}

/**
 * A generic tree component. See propTypes for the public API.
 *
 * This tree component doesn't make any assumptions about the structure of your
 * tree data. Whether children are computed on demand, or stored in an array in
 * the parent's `_children` property, it doesn't matter. We only require the
 * implementation of `getChildren`, `getRoots`, `getParent`, and `isExpanded`
 * functions.
 *
 * This tree component is well tested and reliable. See the tests in ./tests
 * and its usage in the performance and memory panels in mozilla-central.
 *
 * This tree component doesn't make any assumptions about how to render items in
 * the tree. You provide a `renderItem` function, and this component will ensure
 * that only those items whose parents are expanded and which are visible in the
 * viewport are rendered. The `renderItem` function could render the items as a
 * "traditional" tree or as rows in a table or anything else. It doesn't
 * restrict you to only one certain kind of tree.
 *
 * The tree comes with basic styling for the indent, the arrow, as well as hovered
 * and focused styles.
 * All of this can be customize on the customer end, by overriding the following
 * CSS custom properties :
 *   --arrow-width: the width of the arrow.
 *   --arrow-single-margin: the end margin between the arrow and the item that follows.
 *   --arrow-fill-color: the fill-color of the arrow.
 *   --tree-indent-width: the width of a 1-level-deep item.
 *   --tree-indent-border-color: the color of the indent border.
 *   --tree-indent-border-width: the width of the indent border.
 *   --tree-node-hover-background-color: the background color of a hovered node.
 *   --tree-node-focus-color: the color of a focused node.
 *   --tree-node-focus-background-color: the background color of a focused node.
 *
 *
 * ### Example Usage
 *
 * Suppose we have some tree data where each item has this form:
 *
 *     {
 *       id: Number,
 *       label: String,
 *       parent: Item or null,
 *       children: Array of child items,
 *       expanded: bool,
 *     }
 *
 * Here is how we could render that data with this component:
 *
 *     const MyTree = createClass({
 *       displayName: "MyTree",
 *
 *       propTypes: {
 *         // The root item of the tree, with the form described above.
 *         root: PropTypes.object.isRequired
 *       },
 *
 *       render() {
 *         return Tree({
 *           itemHeight: 20, // px
 *
 *           getRoots: () => [this.props.root],
 *
 *           getParent: item => item.parent,
 *           getChildren: item => item.children,
 *           getKey: item => item.id,
 *           isExpanded: item => item.expanded,
 *
 *           renderItem: (item, depth, isFocused, arrow, isExpanded) => {
 *             let className = "my-tree-item";
 *             if (isFocused) {
 *               className += " focused";
 *             }
 *             return dom.div({
 *               className,
 *             },
 *               arrow,
 *               // And here is the label for this item.
 *               dom.span({ className: "my-tree-item-label" }, item.label)
 *             );
 *           },
 *
 *           onExpand: item => dispatchExpandActionToRedux(item),
 *           onCollapse: item => dispatchCollapseActionToRedux(item),
 *         });
 *       }
 *     });
 */
const Tree = createClass({
  displayName: "Tree",

  propTypes: {
    // Required props

    // A function to get an item's parent, or null if it is a root.
    //
    // Type: getParent(item: Item) -> Maybe<Item>
    //
    // Example:
    //
    //     // The parent of this item is stored in its `parent` property.
    //     getParent: item => item.parent
    getParent: PropTypes.func.isRequired,

    // A function to get an item's children.
    //
    // Type: getChildren(item: Item) -> [Item]
    //
    // Example:
    //
    //     // This item's children are stored in its `children` property.
    //     getChildren: item => item.children
    getChildren: PropTypes.func.isRequired,

    // A function which takes an item and ArrowExpander component instance and
    // returns a component, or text, or anything else that React considers
    // renderable.
    //
    // Type: renderItem(item: Item,
    //                  depth: Number,
    //                  isFocused: Boolean,
    //                  arrow: ReactComponent,
    //                  isExpanded: Boolean) -> ReactRenderable
    //
    // Example:
    //
    //     renderItem: (item, depth, isFocused, arrow, isExpanded) => {
    //       let className = "my-tree-item";
    //       if (isFocused) {
    //         className += " focused";
    //       }
    //       return dom.div(
    //         {
    //           className,
    //           style: { marginLeft: depth * 10 + "px" }
    //         },
    //         arrow,
    //         dom.span({ className: "my-tree-item-label" }, item.label)
    //       );
    //     },
    renderItem: PropTypes.func.isRequired,

    // A function which returns the roots of the tree (forest).
    //
    // Type: getRoots() -> [Item]
    //
    // Example:
    //
    //     // In this case, we only have one top level, root item. You could
    //     // return multiple items if you have many top level items in your
    //     // tree.
    //     getRoots: () => [this.props.rootOfMyTree]
    getRoots: PropTypes.func.isRequired,

    // A function to get a unique key for the given item. This helps speed up
    // React's rendering a *TON*.
    //
    // Type: getKey(item: Item) -> String
    //
    // Example:
    //
    //     getKey: item => `my-tree-item-${item.uniqueId}`
    getKey: PropTypes.func.isRequired,

    // A function to get whether an item is expanded or not. If an item is not
    // expanded, then it must be collapsed.
    //
    // Type: isExpanded(item: Item) -> Boolean
    //
    // Example:
    //
    //     isExpanded: item => item.expanded,
    isExpanded: PropTypes.func.isRequired,

    // Optional props

    // The currently focused item, if any such item exists.
    focused: PropTypes.any,

    // Handle when a new item is focused.
    onFocus: PropTypes.func,

    // The depth to which we should automatically expand new items.
    autoExpandDepth: PropTypes.number,
    // Should auto expand all new items or just the new items under the first
    // root item.
    autoExpandAll: PropTypes.bool,

    // Note: the two properties below are mutually exclusive. Only one of the
    // label properties is necessary.
    // ID of an element whose textual content serves as an accessible label for
    // a tree.
    labelledby: PropTypes.string,
    // Accessibility label for a tree widget.
    label: PropTypes.string,

    // Optional event handlers for when items are expanded or collapsed. Useful
    // for dispatching redux events and updating application state, maybe lazily
    // loading subtrees from a worker, etc.
    //
    // Type:
    //     onExpand(item: Item)
    //     onCollapse(item: Item)
    //
    // Example:
    //
    //     onExpand: item => dispatchExpandActionToRedux(item)
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
    isExpandable: PropTypes.func,
    // Additional classes to add to the root element.
    className: PropTypes.string,
    // style object to be applied to the root element.
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      autoExpandDepth: AUTO_EXPAND_DEPTH,
      autoExpandAll: true
    };
  },

  getInitialState() {
    return {
      seen: new Set(),
    };
  },

  componentDidMount() {
    this._autoExpand();
  },

  componentWillReceiveProps(nextProps) {
    this._autoExpand();
  },

  _autoExpand() {
    if (!this.props.autoExpandDepth) {
      return;
    }

    // Automatically expand the first autoExpandDepth levels for new items. Do
    // not use the usual DFS infrastructure because we don't want to ignore
    // collapsed nodes.
    const autoExpand = (item, currentDepth) => {
      if (currentDepth >= this.props.autoExpandDepth ||
          this.state.seen.has(item)) {
        return;
      }

      this.props.onExpand(item);
      this.state.seen.add(item);

      const children = this.props.getChildren(item);
      const length = children.length;
      for (let i = 0; i < length; i++) {
        autoExpand(children[i], currentDepth + 1);
      }
    };

    const roots = this.props.getRoots();
    const length = roots.length;
    if (this.props.autoExpandAll) {
      for (let i = 0; i < length; i++) {
        autoExpand(roots[i], 0);
      }
    } else if (length != 0) {
      autoExpand(roots[0], 0);
    }
  },

  _preventArrowKeyScrolling(e) {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent) {
          if (e.nativeEvent.preventDefault) {
            e.nativeEvent.preventDefault();
          }
          if (e.nativeEvent.stopPropagation) {
            e.nativeEvent.stopPropagation();
          }
        }
    }
  },

  /**
   * Perform a pre-order depth-first search from item.
   */
  _dfs(item, maxDepth = Infinity, traversal = [], _depth = 0) {
    traversal.push({ item, depth: _depth });

    if (!this.props.isExpanded(item)) {
      return traversal;
    }

    const nextDepth = _depth + 1;

    if (nextDepth > maxDepth) {
      return traversal;
    }

    const children = this.props.getChildren(item);
    const length = children.length;
    for (let i = 0; i < length; i++) {
      this._dfs(children[i], maxDepth, traversal, nextDepth);
    }

    return traversal;
  },

  /**
   * Perform a pre-order depth-first search over the whole forest.
   */
  _dfsFromRoots(maxDepth = Infinity) {
    const traversal = [];

    const roots = this.props.getRoots();
    const length = roots.length;
    for (let i = 0; i < length; i++) {
      this._dfs(roots[i], maxDepth, traversal);
    }

    return traversal;
  },

  /**
   * Expands current row.
   *
   * @param {Object} item
   * @param {Boolean} expandAllChildren
   */
  _onExpand: oncePerAnimationFrame(function (item, expandAllChildren) {
    if (this.props.onExpand) {
      this.props.onExpand(item);

      if (expandAllChildren) {
        const children = this._dfs(item);
        const length = children.length;
        for (let i = 0; i < length; i++) {
          this.props.onExpand(children[i].item);
        }
      }
    }
  }),

  /**
   * Collapses current row.
   *
   * @param {Object} item
   */
  _onCollapse: oncePerAnimationFrame(function (item) {
    if (this.props.onCollapse) {
      this.props.onCollapse(item);
    }
  }),

  /**
   * Sets the passed in item to be the focused item.
   *
   * @param {Number} index
   *        The index of the item in a full DFS traversal (ignoring collapsed
   *        nodes). Ignored if `item` is undefined.
   *
   * @param {Object|undefined} item
   *        The item to be focused, or undefined to focus no item.
   */
  _focus(index, item) {
    // TODO: Revisit how we should handle focus without having fixed item height.
    // if (item !== undefined) {
    //   const itemStartPosition = index * this.props.itemHeight;
    //   const itemEndPosition = (index + 1) * this.props.itemHeight;

    //   // Note that if the height of the viewport (this.state.height) is less than
    //   // `this.props.itemHeight`, we could accidentally try and scroll both up and
    //   // down in a futile attempt to make both the item's start and end positions
    //   // visible. Instead, give priority to the start of the item by checking its
    //   // position first, and then using an "else if", rather than a separate "if",
    //   // for the end position.
    //   if (this.state.scroll > itemStartPosition) {
    //     this.refs.tree.scrollTop = itemStartPosition;
    //   } else if ((this.state.scroll + this.state.height) < itemEndPosition) {
    //     this.refs.tree.scrollTop = itemEndPosition - this.state.height;
    //   }
    // }

    if (this.props.onFocus) {
      this.props.onFocus(item);
    }
  },

  /**
   * Sets the state to have no focused item.
   */
  _onBlur() {
    this._focus(0, undefined);
  },

  /**
   * Handles key down events in the tree's container.
   *
   * @param {Event} e
   */
  _onKeyDown(e) {
    if (this.props.focused == null) {
      return;
    }

    // Allow parent nodes to use navigation arrows with modifiers.
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
      return;
    }

    this._preventArrowKeyScrolling(e);

    switch (e.key) {
      case "ArrowUp":
        this._focusPrevNode();
        return;

      case "ArrowDown":
        this._focusNextNode();
        return;

      case "ArrowLeft":
        if (this.props.isExpanded(this.props.focused)
            && this._nodeIsExpandable(this.props.focused)) {
          this._onCollapse(this.props.focused);
        } else {
          this._focusParentNode();
        }
        return;

      case "ArrowRight":
        if (!this.props.isExpanded(this.props.focused)) {
          this._onExpand(this.props.focused);
        } else {
          this._focusNextNode();
        }
    }
  },

  /**
   * Sets the previous node relative to the currently focused item, to focused.
   */
  _focusPrevNode: oncePerAnimationFrame(function () {
    // Start a depth first search and keep going until we reach the currently
    // focused node. Focus the previous node in the DFS, if it exists. If it
    // doesn't exist, we're at the first node already.

    let prev;
    let prevIndex;

    const traversal = this._dfsFromRoots();
    const length = traversal.length;
    for (let i = 0; i < length; i++) {
      const item = traversal[i].item;
      if (item === this.props.focused) {
        break;
      }
      prev = item;
      prevIndex = i;
    }

    if (prev === undefined) {
      return;
    }

    this._focus(prevIndex, prev);
  }),

  /**
   * Handles the down arrow key which will focus either the next child
   * or sibling row.
   */
  _focusNextNode: oncePerAnimationFrame(function () {
    // Start a depth first search and keep going until we reach the currently
    // focused node. Focus the next node in the DFS, if it exists. If it
    // doesn't exist, we're at the last node already.

    const traversal = this._dfsFromRoots();
    const length = traversal.length;
    let i = 0;

    while (i < length) {
      if (traversal[i].item === this.props.focused) {
        break;
      }
      i++;
    }

    if (i + 1 < traversal.length) {
      this._focus(i + 1, traversal[i + 1].item);
    }
  }),

  /**
   * Handles the left arrow key, going back up to the current rows'
   * parent row.
   */
  _focusParentNode: oncePerAnimationFrame(function () {
    const parent = this.props.getParent(this.props.focused);
    if (!parent) {
      return;
    }

    const traversal = this._dfsFromRoots();
    const length = traversal.length;
    let parentIndex = 0;
    for (; parentIndex < length; parentIndex++) {
      if (traversal[parentIndex].item === parent) {
        break;
      }
    }

    this._focus(parentIndex, parent);
  }),

  _nodeIsExpandable: function (item) {
    return this.props.isExpandable
      ? this.props.isExpandable(item)
      : !!this.props.getChildren(item).length;
  },

  render() {
    const traversal = this._dfsFromRoots();
    const {
      focused,
    } = this.props;

    const nodes = traversal.map((v, i) => {
      const { item, depth } = traversal[i];
      const key = this.props.getKey(item, i);
      return TreeNode({
        key,
        id: key,
        index: i,
        item,
        depth,
        renderItem: this.props.renderItem,
        focused: focused === item,
        expanded: this.props.isExpanded(item),
        isExpandable: this._nodeIsExpandable(item),
        onExpand: this._onExpand,
        onCollapse: this._onCollapse,
        onClick: (e) => {
          this._focus(i, item);
          if (this.props.isExpanded(item)) {
            this.props.onCollapse(item);
          } else {
            this.props.onExpand(item, e.altKey);
          }
        },
      });
    });

    const style = Object.assign({}, this.props.style || {}, {
      padding: 0,
      margin: 0
    });

    return dom.div(
      {
        className: `tree ${this.props.className ? this.props.className : ""}`,
        ref: "tree",
        role: "tree",
        tabIndex: "0",
        onKeyDown: this._onKeyDown,
        onKeyPress: this._preventArrowKeyScrolling,
        onKeyUp: this._preventArrowKeyScrolling,
        onFocus: ({nativeEvent}) => {
          if (focused || !nativeEvent || !this.refs.tree) {
            return;
          }

          let { explicitOriginalTarget } = nativeEvent;
          // Only set default focus to the first tree node if the focus came
          // from outside the tree (e.g. by tabbing to the tree from other
          // external elements).
          if (explicitOriginalTarget !== this.refs.tree &&
              !this.refs.tree.contains(explicitOriginalTarget)) {
            this._focus(0, traversal[0].item);
          }
        },
        onBlur: this._onBlur,
        onClick: () => {
          // Focus should always remain on the tree container itself.
          this.refs.tree.focus();
        },
        "aria-label": this.props.label,
        "aria-labelledby": this.props.labelledby,
        "aria-activedescendant": focused && this.props.getKey(focused),
        style,
      },
      nodes
    );
  },
});

export default Tree;
