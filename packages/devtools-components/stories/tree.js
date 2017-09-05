/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
const { DOM: dom, createClass, createFactory } = React;

import Components from "../index";
const Tree = createFactory(Components.Tree);
import { storiesOf } from "@storybook/react";

storiesOf("Tree", module)
  .add("Simple tree - autoExpand 1", () => {
    return renderTree({
      autoExpandDepth: 1,
    });
  })
  .add("Simple tree - autoExpand 2", () => {
    return renderTree({
      autoExpandDepth: 2,
    });
  })
  .add("Simple tree - autoExpand ∞", () => {
    return renderTree({
      autoExpandDepth: Infinity,
    });
  })
  .add("Multiple root tree", () => {
    return renderTree({
      autoExpandDepth: Infinity,
      getRoots: () => ["A", "W"],
    });
  })
  .add("focused node", () => {
    return renderTree({
      focused: "W",
      getRoots: () => ["A", "W"],
      expanded: new Set(["A"])
    });
  });

// Encoding of the following tree/forest:
//
// A
// |-- B
// |   |-- E
// |   |   |-- K
// |   |   `-- L
// |   |-- F
// |   `-- G
// |-- C
// |   |-- H
// |   `-- I
// `-- D
//     `-- J
// M
// `-- N
//     `-- O
const TEST_TREE = {
  children: {
    A: ["B", "C", "D"],
    B: ["E", "F", "G"],
    C: ["H", "I"],
    D: ["J"],
    E: ["K", "L"],
    F: [],
    G: [],
    H: [],
    I: [],
    J: [],
    K: [],
    L: [],
    M: ["N"],
    N: ["O"],
    O: [],
    W: ["X", "Y"],
    X: ["Z"],
    Y: [],
    Z: [],
  },
  parent: {
    A: null,
    B: "A",
    C: "A",
    D: "A",
    E: "B",
    F: "B",
    G: "B",
    H: "C",
    I: "C",
    J: "D",
    K: "E",
    L: "E",
    M: null,
    N: "M",
    O: "N",
    W: null,
    X: "W",
    Y: "W",
    Z: "X",
  },
};

function renderTree(props) {
  return createFactory(createClass({
    displayName: "container",
    getInitialState() {
      const state = {
        expanded: props.expanded || new Set(),
        focused: props.focused
      };
      delete props.focused;
      return state;
    },
    render() {
      return Tree(Object.assign({
        getParent: x => TEST_TREE.parent[x],
        getChildren: x => TEST_TREE.children[x],
        renderItem: (x, depth, focused, arrow, expanded) => dom.div({},
          arrow,
          x,
        ),
        getRoots: () => ["A"],
        getKey: x => "key-" + x,
        itemHeight: 1,
        onFocus: x => {
          this.setState(previousState => {
            return {focused: x};
          });
        },
        onExpand: x => {
          this.setState(previousState => {
            const expanded = new Set(previousState.expanded);
            expanded.add(x);
            return {expanded};
          });
        },
        onCollapse: x => {
          this.setState(previousState => {
            const expanded = new Set(previousState.expanded);
            expanded.delete(x);
            return {expanded};
          });
        },
        isExpanded: x => this.state && this.state.expanded.has(x),
        focused: this.state.focused,
      }, props));
    }
  }))();
}
