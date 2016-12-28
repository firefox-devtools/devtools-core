const React = require("react");
const { storiesOf, action } = require("@kadira/storybook");
const LandingPage = require("../src/components/LandingPage");

const { combineReducers } = require("redux");
let reducers = require("../src/reducers");
let constants = require("../src/constants");
let getState = combineReducers(reducers);
const selectors = require("../src/selectors");

// Add devtools theme styles
require("../src/lib/themes/light-theme.css");
document.body.classList.add("theme-light");

const getTab = (id, title, clientType, url) => {
  if (!url) {
    url = `/test/${id}`;
  }

  return {
    url,
    clientType,
    id: `${id}`,
    title
  };
};

const getTabs = (tabs, state) => {
  let newState = getState(state, {
    type: constants.ADD_TABS,
    value: tabs
  });

  return selectors.getTabs(newState);
};

const renderLandingPage = (props) => {
  return React.DOM.div({}, React.createElement(LandingPage, Object.assign({
    onFilterChange: action("FILTER_TABS"),
    onTabClick: action("onTabClick")
  }, props)));
};

storiesOf("LandingPage", module)
  .add("six firefox tabs", () => {
    let tabs = [
      getTab(1, "Page 1", "firefox"),
      getTab(2, "Page 2", "firefox"),
      getTab(3, "Page 3", "firefox"),
      getTab(4, "Page 4", "firefox"),
      getTab(5, "Page 5", "firefox"),
      getTab(6, "Page 6", "firefox"),
    ];

    return renderLandingPage({
      tabs: getTabs(tabs),
      supportsFirefox: true,
      supportsChrome: true,
      title: "Storybook test"
    });
  })
  .add("two of each", () => {
    let tabs = [
      getTab(1, "Page 1", "firefox"),
      getTab(2, "Page 2", "firefox"),
      getTab(3, "Page 3", "chrome"),
      getTab(4, "Page 4", "chrome"),
      getTab(5, "process 1", "node"),
      getTab(6, "process 2", "node"),
    ];

    return renderLandingPage({
      tabs: getTabs(tabs),
      supportsFirefox: true,
      supportsChrome: true,
      title: "Storybook test"
    });
  })
  .add("one hundred firefox tabs with long titles and URLs", () => {
    let tabs = Array(100)
      .fill()
      .map((_, i) =>
        getTab(
          i + 1,
          `My very long title ${(`${i + 1}-`).repeat(50)}`,
          "firefox",
          `this/is/a/very/long/url/${(`${i + 1}/`).repeat(50)}`,
        )
      );

    return renderLandingPage({
      tabs: getTabs(tabs),
      supportsFirefox: true,
      supportsChrome: true,
      title: "Storybook test"
    });
  })
  .add("six firefox tabs, filtered with \"MoZ\" (two tabs match)", () => {
    let filterString = "MoZ";
    let tabs = [
      getTab(1, "Mozilla", "firefox"),
      getTab(2, "Page 2", "firefox", "https://mozilla.com"),
      getTab(3, "Page 3", "firefox"),
      getTab(4, "Page 4", "firefox"),
      getTab(5, "Page 5", "firefox"),
      getTab(6, "Page 6", "firefox"),
    ];

    let state = getState(undefined, {
      type: constants.FILTER_TABS,
      value: filterString
    });

    return renderLandingPage({
      tabs: getTabs(tabs, state),
      filterString: selectors.getFilterString(state),
      supportsFirefox: true,
      supportsChrome: true,
      title: "Storybook test"
    });
  });
