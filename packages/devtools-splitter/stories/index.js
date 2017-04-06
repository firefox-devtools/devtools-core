import React, { DOM as dom, createFactory, createElement } from "react";
import { storiesOf, action } from "@kadira/storybook";
import SplitBox from "..";

import "./index.css";

storiesOf("Splitter", module).add("splitter", () => {
  const start = <div style={{ padding: "10px" }}>Yo</div>;
  const end = <div style={{ padding: "10px" }}>Bye</div>;
  return (
    <SplitBox
      startPanel={start}
      endPanel={end}
      splitterSize={1}
      initialSize="50%"
      minSize={10}
      vert={true}
      endPanelControl={true}
      onResizeEnd={action("resizeEnd")}
    />
  );
});
