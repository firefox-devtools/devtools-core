// globals window, document
// require("./webconsole.css")
require("../reps/reps.css");

const React = require("react");
const ReactDOM = require("react-dom");
const { createFactory } = React;

const { bootstrap, L10N } = require("devtools-launchpad");

const { Provider } = require("react-redux");

const RepsConsole = createFactory(require("./components/Console"));
const { configureStore } = require("./store");
const { KeyShortcuts } = require("devtools-sham-modules");

require("./launchpad.css");
L10N.setBundle(require("../strings.js"));
window.l10n = L10N;

function onConnect({ client } = {}) {
  if (!client) {
    return;
  }

  let store = configureStore({
    makeThunkArgs: (args, state) => {
      return Object.assign({}, args, { client });
    }
  });

  let shortcuts = new KeyShortcuts({ window });

  ReactDOM.render(
    React.createElement(
      Provider,
      {store},
      RepsConsole({ client, shortcuts })
    ),
    root
  );
}

let root = document.createElement("div");
root.innerText = "Waiting for connection";

bootstrap(React, ReactDOM, root)
  .then(
    onConnect,
    e => console.error("An error occured during the connection", e)
  )
  .catch(e => console.error("An error occured in the onConnect function", e));
