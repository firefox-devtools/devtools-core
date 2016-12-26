const React = require("react");
const { storiesOf } = require("@kadira/storybook");
const LandingPage = require("../src/components/LandingPage");
const { Map } = require("immutable");

// Add devtools theme styles
require("../src/lib/themes/light-theme.css");
document.body.classList.add("theme-light");

const getTab = (id, title, clientType, url) => {
  if (!url) {
    url = `/test/${id}`;
  }
  return [id, Map({
    url,
    clientType,
    id,
    title
  })];
};

storiesOf("LandingPage", module)
  .add("six firefox tabs", () => {
    let tabs = Map([
      getTab(1, "Page 1", "firefox"),
      getTab(2, "Page 2", "firefox"),
      getTab(3, "Page 3", "firefox"),
      getTab(4, "Page 4", "firefox"),
      getTab(5, "Page 5", "firefox"),
      getTab(6, "Page 6", "firefox"),
    ]);

    return React.DOM.div(
      {},
      React.createElement(LandingPage, {
        tabs,
        supportsFirefox: true,
        supportsChrome: true,
        title: "Storybook test"
      })
    );
  }).add("two of each", () => {
    let tabs = Map([
      getTab(1, "Page 1", "firefox"),
      getTab(2, "Page 2", "firefox"),
      getTab(3, "Page 3", "chrome"),
      getTab(4, "Page 4", "chrome"),
      getTab(5, "process 1", "node"),
      getTab(6, "process 2", "node"),
    ]);

    return React.DOM.div(
      { },
      React.createElement(LandingPage, {
        tabs,
        supportsFirefox: true,
        supportsChrome: true,
        title: "Storybook test"
      })
    );
  })
  .add("one hundred firefox tabs with long titles and URLs", () => {
    let tabs = Map(
      Array(100)
        .fill()
        .map((_, i) =>
          getTab(
            i + 1,
            `My very long title ${("-" + i + 1).repeat(50)}`,
            "firefox",
            `this/is/a/very/long/url/${("" + i + 1).repeat(100)}`
          )
        )
    );

    return React.DOM.div(
      {},
      React.createElement(LandingPage, {
        tabs,
        supportsFirefox: true,
        supportsChrome: true,
        title: "Storybook test"
      })
    );
  });
