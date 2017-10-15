const React = require("react");
const Component = React.Component;
const ReactDom = require("react-dom");
const { combineReducers, bindActionCreators } = require("redux");

const dom = React.DOM;
const { renderRoot } = require("devtools-launchpad/src/index");
const reducers = require("./reducers");
const configureStore = require("./utils/create-store");

const createStore = configureStore({
  log: false,
  makeThunkArgs: (args, state) => {
    return Object.assign({}, args, {});
  }
});

const store = createStore(combineReducers(reducers));
const actions = bindActionCreators(require("./actions"), store.dispatch);

require("./index.css");
const App = React.createClass({
  propTypes: { a: 2 },

  render() {
    return dom.h1({}, "Style Guide");
  }
});

renderRoot(React, ReactDom, App);
