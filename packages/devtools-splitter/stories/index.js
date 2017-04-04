import React, { DOM as dom, createFactory, createElement } from "react";
import { storiesOf, action } from "@kadira/storybook";
import SplitBox from "..";

storiesOf("Button", module)
  .add("splitter", () => (
    <SplitBox
      startPanel="yo"
      endPanel="bye"
      splitterSize={2}
      style={{ width: "100vw", border: "1px solid grey" }}
      initialSize="250px"
      minSize={10}
      maxSize="50%"
      vert={true}
      endPanelControl={true}
    />
  ))
  .add("with text", () => (
    <button onClick={action("clicked")}>Hello Button</button>
  ))
  .add("with some emoji", () => (
    <button onClick={action("clicked")}>😀 😎 👍 💯</button>
  ));
