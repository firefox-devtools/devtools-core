const React = require("react");
const { DOM: dom } = React;
const { showMenu, buildMenu } = require("../menu");

const Settings = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
    setValue: React.PropTypes.func.isRequired
  },

  displayName: "Settings",

  onConfigContextMenu(event, key) {
    event.preventDefault();

    const { setValue, config } = this.props;

    const setConfig = (path, value) => {
      setValue(path, value);
    };

    const ltrMenuItem = {
      id: "node-menu-ltr",
      label: "ltr",
      disabled: config[key] === "ltr",
      click: () => setConfig(key, "ltr")
    };

    const rtlMenuItem = {
      id: "node-menu-rtl",
      label: "rtl",
      disabled: config[key] === "rtl",
      click: () => setConfig(key, "rtl")
    };

    const lightMenuItem = {
      id: "node-menu-light",
      label: "light",
      disabled: config[key] === "light",
      click: () => setConfig(key, "light")
    };

    const darkMenuItem = {
      id: "node-menu-dark",
      label: "dark",
      disabled: config[key] === "dark",
      click: () => setConfig(key, "dark")
    };

    const firebugMenuItem = {
      id: "node-menu-firebug",
      label: "firebug",
      disabled: config[key] === "firebug",
      click: () => setConfig(key, "firebug")
    };

    const items = {
      "dir": [
        { item: ltrMenuItem },
        { item: rtlMenuItem },
      ],
      "theme": [
        { item: lightMenuItem },
        { item: darkMenuItem },
        { item: firebugMenuItem }
      ]
    };
    showMenu(event, buildMenu(items[key]));
  },

  onInputHandler(e, path) {
    const { setValue } = this.props;
    setValue(path, e.target.checked);
  },

  renderConfig(config) {
    const configs = [
      { name: "dir", label: "direction" },
      { name: "theme", label: "theme" }
      // Hiding hotReloading option for now. See Issue #242
      // { name: "hotReloading", label: "hot reloading", bool: true }
    ];

    return dom.ul(
      { className: "tab-list" },
      configs.map(c => {
        return dom.li({ key: c.name, className: "tab tab-sides" },
          dom.div({ className: "tab-title" }, c.label),
          c.bool ? dom.input({
            type: "checkbox",
            defaultChecked: config[c.name],
            onChange: e => this.onInputHandler(e, c.name)
          }, null) : dom.div({
            className: "tab-value",
            onClick: e => this.onConfigContextMenu(e, c.name)
          }, config[c.name])
        );
      })
    );
  },

  renderFeatures(features) {
    return dom.ul(
      { className: "tab-list" },
      Object.keys(features).map(key => dom.li(
        {
          className: "tab tab-sides",
          key
        },
        dom.div({ className: "tab-title" },
          typeof features[key] == "object" ?
            features[key].label :
            key
        ),
        dom.div({ className: "tab-value" },
          dom.input(
            {
              type: "checkbox",
              defaultChecked: features[key].enabled,
              onChange: e => this.onInputHandler(e, `features.${key}.enabled`)
            },
          )
        )
      ))
    );
  },

  render() {
    const { config } = this.props;

    return dom.div(
      { className: "tab-group" },
      dom.h3({}, "Configurations"),
      this.renderConfig(config),
      config.features ?
      (
        dom.h3({}, "Features"),
        this.renderFeatures(config.features)
      ) : null
    );
  }
});

module.exports = Settings;
