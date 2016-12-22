const React = require("react");
const { createFactory } = React;

const ReactDOM = require("react-dom");
const RepsConsole = createFactory(require("./components/Console"));

// require("./webconsole.css")
require("../reps.css");

const { bootstrap, L10N } = require("devtools-launchpad");
const { isFirefoxPanel } = require("devtools-config");

if (!isFirefoxPanel()) {
  require("./launchpad.css");
  L10N.setBundle(require("../strings.js"));
  window.l10n = L10N;

  function onConnect({ client } = {}) {
    if (!client) {
      return;
    }

    ReactDOM.render(RepsConsole({ client }), root);
  }

  let root = document.createElement("div");
  root.innerText = "Waiting for connection";

  bootstrap(React, ReactDOM, root)
    .then(onConnect);
} else {
  const { MODE } = require("../reps/constants");
  const Rep = createFactory(require("../reps/rep"));
  const Grip = require("../reps/grip");

  module.exports = {
    Rep,
    Grip,
    MODE
  };
}
