const { score } = require("fuzzaldrin-plus");

function getTabs(state) {
  let tabs = state.tabs.get("tabs");
  let filterString = getFilterString(state);

  if (filterString === "") {
    return tabs;
  }

  return tabs.map(tab => {
    const _overallScore =
    score(tab.get("title"), filterString) +
    score(tab.get("url"), filterString);
    return tab.set("filteredOut", _overallScore === 0);
  }
);
}

function getSelectedTab(state) {
  return state.tabs.get("selectedTab");
}

function getFilterString(state) {
  return state.tabs.get("filterString");
}

function getConfig(state) {
  return state.config.get("config").toJS();
}

module.exports = {
  getTabs,
  getSelectedTab,
  getFilterString,
  getConfig
};
