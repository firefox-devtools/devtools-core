const React = require("react");
const ReactDOM = require("react-dom");
const { combineReducers } = require("redux");
const { getClient, firefox } = require("devtools-client-adapters");
const configureStore = require("./utils/create-store");
const reducers = require("./reducers");

const { bootstrap } = require("./index");

const App = React.createClass({
  propTypes: {},
  displayName: "App",
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
    return Object.assign({}, args, { client: getClient(state) });
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
    const tabTarget = firefox.getTabTarget();
    console.log(`connected to ${tabTarget._form.url}`);
  }
}

bootstrap(React, ReactDOM, App, null, store).then(onConnect);
