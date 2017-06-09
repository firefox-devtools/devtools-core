/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const ReactDOM = require("react-dom");
const { combineReducers } = require("redux");
const configureStore = require("./utils/create-store");
const reducers = require("./reducers");

const { bootstrap } = require("./index");

const App = React.createClass({
  displayName: "App",
  propTypes: {},
  render() {
    return React.DOM.div({
      style: {
        margin: "100px auto",
        "text-align": "center"
      }
    }, "Launchpad Connected");
  }
});

const createStore = configureStore({
  log: false,
  makeThunkArgs: (args, state) => {
    return Object.assign({}, args, { });
  }
});

const store = createStore(combineReducers(reducers));
// const actions = bindActionCreators(require("./actions"), store.dispatch);

async function onConnect(connection: Object) {
  // NOTE: the landing page does not connect to a JS process
  if (!connection) {
    return;
  }

  const { tab } = connection;
  if (tab && tab.clientType == "firefox") {
    console.log(`connected to ${tab.url}`);
  }
}

bootstrap(React, ReactDOM, App, null, store).then(onConnect);
