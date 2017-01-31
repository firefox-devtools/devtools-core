const Services = require("./client/shared/shim/Services");
const SplitBox = require("./client/shared/components/splitter/SplitBox");
// const SplitBoxCSS = require("./client/shared/components/splitter/SplitBox.css")
const { Tabs, TabPanel } = require("./client/shared/components/tabs/Tabs");
const TreeView = require("./client/shared/components/tree/tree-view");
const sprintf = require("./shared/sprintf").sprintf;

module.exports = {
  Services,
  SplitBox,
  // SplitBoxCSS,
  Tabs,
  TabPanel,
  TreeView,
  sprintf
};
