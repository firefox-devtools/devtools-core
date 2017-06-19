/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// globals window, document
require("../reps/reps.css");

const React = require("react");
const ReactDOM = require("react-dom");

const { bootstrap, L10N, renderRoot } = require("devtools-launchpad");

const RepsConsole = require("./components/Console");
const { configureStore } = require("./store");

require("./launchpad.css");
L10N.setBundle(require("../strings.js"));
window.l10n = L10N;

function onConnect(connection) {
  if (!connection) {
    return;
  }

  const client = {
    clientCommands: {
      evaluate: input => new Promise(resolve => {
        connection.tabConnection.tabTarget.activeConsole.evaluateJS(
          input,
          result => resolve(result)
        );
      })
    }
  };

  let store = configureStore({
    makeThunkArgs: (args, state) => {
      return Object.assign({}, args, { client });
    }
  });
  renderRoot(React, ReactDOM, RepsConsole, store);
}

function onConnectionError(e) {
  const h1 = document.createElement("h1");
  h1.innerText = `An error occured during the connection: «${e.message}»`;
  console.warn("An error occured during the connection", e);
  renderRoot(React, ReactDOM, h1);
}

bootstrap(React, ReactDOM)
  .then(onConnect, onConnectionError)
  .catch(onConnectionError);
