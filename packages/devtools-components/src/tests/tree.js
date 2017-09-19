/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from "react";
import { mount } from "enzyme";
import Components from "../../index";

const { DOM: dom, createClass, createFactory } = React;
const Tree = createFactory(Components.Tree);

function mountTree(overrides = {}) {
  return mount(createFactory(createClass({
    displayName: "container",
    getInitialState() {
      const state = {
        expanded: overrides.expanded || new Set(),
        focused: overrides.focused
      };
      delete overrides.focused;
      return state;
    },
    render() {
      return Tree(Object.assign({
        getParent: x => TEST_TREE.parent[x],
        getChildren: x => TEST_TREE.children[x],
        renderItem: (x, depth, focused, arrow) => {
          return dom.div({},
            arrow,
            focused ? "[" : null,
            x,
            focused ? "]" : null
          );
        },
        getRoots: () => ["A", "M"],
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
      }, overrides));
    }
  }))());
}

describe("Tree", () => {
  it("does not throw", () => {
    expect(mountTree()).toBeTruthy();
  });

  it.only("is accessible", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
    });
    expect(wrapper.getDOMNode().getAttribute("role")).toBe("tree");
    expect(wrapper.getDOMNode().getAttribute("tabIndex")).toBe("0");

    getTreeNodes(wrapper)
      .everyWhere(node => expect(
        node.prop("id").startsWith("key-")
        && node.prop("role") === "treeitem"
        && typeof node.prop("aria-level") !== "undefined"
      ).toBe(true));
  });

  it("renders as expected", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split(""))
    });

    expect(formatTree(wrapper)).toMatchSnapshot();
  });

  it("renders as expected when passed a className", () => {
    const wrapper = mountTree({
      className: "testClassName"
    });

    expect(wrapper.hasClass("testClassName")).toBe(true);
    expect(wrapper.hasClass("tree")).toBe(true);
  });

  it("renders as expected when passed a style", () => {
    const wrapper = mountTree({
      style: {
        color: "red"
      }
    });

    expect(wrapper.getDOMNode().style.color).toBe("red");
  });

  it("renders as expected when passed a label", () => {
    const wrapper = mountTree({
      label: "testAriaLabel",
    });
    expect(wrapper.getDOMNode().getAttribute("aria-label")).toBe("testAriaLabel");
  });

  it("renders as expected when passed an aria-labelledby", () => {
    const wrapper = mountTree({
      labelledby: "testAriaLabelBy",
    });
    expect(wrapper.getDOMNode().getAttribute("aria-labelledby")).toBe("testAriaLabelBy");
  });

  it("renders as expected with collapsed nodes", () => {
    const wrapper = mountTree({
      expanded: new Set("MNO".split(""))
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
  });

  it("renders as expected when passed autoDepth:1", () => {
    const wrapper = mountTree({
      autoExpandDepth: 1
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
  });

  it("renders as expected when given a focused item", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "G"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-G");

    getTreeNodes(wrapper).first().simulate("click");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-A");

    getTreeNodes(wrapper).first().simulate("click");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-A");

    wrapper.simulate("blur");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("renders as expected when navigating up with the keyboard", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "L"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-L");

    simulateKeyDown(wrapper, "ArrowUp");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-K");

    simulateKeyDown(wrapper, "ArrowUp");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-E");
  });

  it("renders as expected when navigating up with the keyboard on a root", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "A"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-A");

    simulateKeyDown(wrapper, "ArrowUp");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-A");
  });

  it("renders as expected when navigating down with the keyboard", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "K"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-K");

    simulateKeyDown(wrapper, "ArrowDown");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-L");

    simulateKeyDown(wrapper, "ArrowDown");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-F");
  });

  it("renders as expected when navigating down with the keyboard on last node", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "O"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-O");

    simulateKeyDown(wrapper, "ArrowDown");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-O");
  });

  it("renders as expected when navigating with right/left arrows", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "L"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-L");

    simulateKeyDown(wrapper, "ArrowLeft");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-E");

    simulateKeyDown(wrapper, "ArrowLeft");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-E");

    simulateKeyDown(wrapper, "ArrowRight");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-E");

    simulateKeyDown(wrapper, "ArrowRight");
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-K");
  });

  it("ignores key strokes when pressing modifiers", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split("")),
      focused: "L"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
    expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-L");

    let testKeys = [
      { key: "ArrowDown"},
      { key: "ArrowUp"},
      { key: "ArrowLeft"},
      { key: "ArrowRight"},
    ];
    let modifiers = [
      { altKey: true },
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
    ];

    for (let key of testKeys) {
      for (let modifier of modifiers) {
        wrapper.simulate("keydown", Object.assign({}, key, modifier));
        expect(formatTree(wrapper)).toMatchSnapshot();
        expect(wrapper.getDOMNode().getAttribute("aria-activedescendant")).toBe("key-L");
      }
    }
  });

  it("renders arrows as expected when nodes are expanded", () => {
    const wrapper = mountTree({
      expanded: new Set("ABCDEFGHIJKLMNO".split(""))
    });
    expect(formatTree(wrapper)).toMatchSnapshot();

    getTreeNodes(wrapper).forEach(n => {
      if ("ABECDMN".split("").includes(n.text())) {
        expect(n.find(".arrow.expanded").exists()).toBe(true);
      } else {
        expect(n.find(".arrow").exists()).toBe(false);
      }
    });
  });

  it("renders arrows as expected when nodes are collapsed", () => {
    const wrapper = mountTree();
    expect(formatTree(wrapper)).toMatchSnapshot();

    getTreeNodes(wrapper).forEach(n => {
      const arrow = n.find(".arrow");
      expect(arrow.exists()).toBe(true);
      expect(arrow.hasClass("expanded")).toBe(false);
    });
  });

  it("uses isExpandable prop if it exists to render tree nodes", () => {
    const wrapper = mountTree({
      isExpandable: item => item === "A"
    });
    expect(formatTree(wrapper)).toMatchSnapshot();
  });

  it("adds the expected data-expandable attribute", () => {
    const wrapper = mountTree({
      isExpandable: item => item === "A"
    });
    const nodes = getTreeNodes(wrapper);
    expect(nodes.at(0).prop("data-expandable")).toBe(true);
    expect(nodes.at(1).prop("data-expandable")).toBe(false);
  });
});

function getTreeNodes(wrapper) {
  return wrapper.find(".tree-node");
}

function simulateKeyDown(wrapper, key) {
  wrapper.simulate("keydown", {
    key,
    preventDefault: () => {},
    stopPropagation: () => {}
  });
}

/*
 * Takes an Enzyme wrapper (obtained with mount/mount/…) and
 * returns a stringified version of the Tree, e.g.
 *
 *   ▼ A
 *   |   ▼ B
 *   |   |   ▼ E
 *   |   |   |   K
 *   |   |   |   L
 *   |   |   F
 *   |   |   G
 *   |   ▼ C
 *   |   |   H
 *   |   |   I
 *   |   ▼ D
 *   |   |   J
 *   ▼ M
 *   |   ▼ N
 *   |   |   O
 *
 */
function formatTree(wrapper) {
  return getTreeNodes(wrapper)
    .map((node) => {
      const level = node.prop("aria-level");
      const indentStr = "|  ".repeat(level || 0);
      const arrow = node.find(".arrow");
      let arrowStr = "  ";
      if (arrow.exists()) {
        arrowStr = arrow.hasClass("expanded") ? "▼ " : "▶︎ ";
      } else {
        arrowStr = "  ";
      }
      return `${indentStr}${arrowStr}${node.text()}`;
    })
    .join("\n");
}

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
var TEST_TREE = {
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
};
