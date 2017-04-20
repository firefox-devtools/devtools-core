const clipboardHelper = require("./shared/clipboard");
const Menu = require("./client/framework/menu");
const MenuItem = require("./client/framework/menu-item");
const PrefsHelper = require("./client/shared/prefs").PrefsHelper;
const Services = require("./client/shared/shim/Services");
const sprintf = require("./shared/sprintf").sprintf;
const Tree = require("./client/shared/components/tree");
const defer = require("./shared/defer");
const { KeyShortcuts } = require("./client/shared/key-shortcuts");
const { PluralForm } = require("./shared/plural-form");

module.exports = {
  defer,
  KeyShortcuts,
  Menu,
  MenuItem,
  PluralForm,
  PrefsHelper,
  Services,
  sprintf,
  Tree,
  clipboardHelper,
};
