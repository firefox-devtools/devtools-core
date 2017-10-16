import React from "react";
import ReactDom from "react-dom";
import { combineReducers, bindActionCreators } from "redux";

import { renderRoot } from "devtools-launchpad/src/index";
import reducers from "./reducers";
import configureStore from "./utils/create-store";

import Layout from "./components/layout";

const createStore = configureStore({
  log: false,
  makeThunkArgs: (args, state) => {
    return Object.assign({}, args, {});
  }
});

const store = createStore(combineReducers(reducers));
const actions = bindActionCreators(require("./actions"), store.dispatch);

renderRoot(React, ReactDom, Layout);
