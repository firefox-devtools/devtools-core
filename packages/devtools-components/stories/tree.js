/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

const {DOM: dom, createFactory} = require("react");
const { storiesOf, action } = require("@kadira/storybook");
const { Tree } = require("../index")

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
    O: []
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
    O: "N"
  },
  expanded: new Set(),
};

storiesOf("Tree", module)
  .add("Simple tree", () => {
    return createFactory(Tree)({
      autoExpandDepth: Infinity,
      getParent: x => TEST_TREE.parent[x],
      getChildren: x => TEST_TREE.children[x],
      renderItem: (x, depth, focused, arrow, expanded) => dom.div({
        style: {
          paddingLeft: depth * 20
        }
      },
        arrow,
        x,
        focused ? "(focused)" : null
      ),
      getRoots: () => ["A"],
      getKey: x => "key-" + x,
      itemHeight: 1,
      onExpand: x => TEST_TREE.expanded.add(x),
      onCollapse: x => TEST_TREE.expanded.delete(x),
      isExpanded: x => TEST_TREE.expanded.has(x),
    });
  });
