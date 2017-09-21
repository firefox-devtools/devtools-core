/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
const { DOM: dom, createClass, createFactory, createElement } = React;

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
  })
  .add("scrollable tree", () => {
    const nodes = Array.from({length: 500}).map((_, i) => (i + 1).toString());

    return createFactory(createClass({
      displayName: "container",
      getInitialState() {
        const state = {
          expanded: new Set(),
          focused: null
        };
        return state;
      },
      render() {
        return createElement("div", {},
          createElement("label", {
            style: {position: "fixed", right: 0},
          },
            "Enter node number to set focus on: ",
            createElement("input", {
              type: "number",
              min: 1,
              max: 500,
              onInput: e => {
                // Storing balue since `e` can be reused by the time the setState
                // callback is called.
                const value = e.target.value.toString();
                this.setState(previousState => {
                  return {focused: value};
                });
              }
            }),
          ),
          createTreeElement({getRoots: () => nodes}, this, {})
        );
      }
    }))();
  })
  .add("scrollable tree with focused node", () => {
    const nodes = Array.from({length: 500}).map((_, i) => `item ${i + 1}`);
    return renderTree({
      focused: "item 250",
      getRoots: () => nodes,
    }, {});
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

function renderTree(props, tree = TEST_TREE) {
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
      return createTreeElement(props, this, tree);
    }
  }))();
}

function createTreeElement(props, context, tree) {
  return Tree(Object.assign({
    getParent: x => tree.parent && tree.parent[x],
    getChildren: x => tree.children
      ? tree.children[x]
      : [],
    renderItem: (x, depth, focused, arrow, expanded) => dom.div({},
      arrow,
      x,
    ),
    getRoots: () => ["A"],
    getKey: x => "key-" + x,
    itemHeight: 1,
    onFocus: x => {
      context.setState(previousState => {
        return {focused: x};
      });
    },
    onExpand: x => {
      context.setState(previousState => {
        const expanded = new Set(previousState.expanded);
        expanded.add(x);
        return {expanded};
      });
    },
    onCollapse: x => {
      context.setState(previousState => {
        const expanded = new Set(previousState.expanded);
        expanded.delete(x);
        return {expanded};
      });
    },
    isExpanded: x => context.state && context.state.expanded.has(x),
    focused: context.state.focused,
  }, props));
}
