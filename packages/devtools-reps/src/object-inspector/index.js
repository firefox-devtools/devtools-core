/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const { createElement, createFactory, PureComponent } = require("react");
const { Provider } = require("react-redux");
const ObjectInspector = createFactory(require("./component"));
const createStore = require("./store");

import type { Props, State } from "./types";

class OI extends PureComponent {

  constructor(props: Props) {
    super(props);
    this.store = createStore(props);
  }

  store: {dispatch: (any) => any, getState: () => State};

  getStore() {
    return this.store;
  }

  render() {
    return createElement(
      Provider,
      {store: this.store},
      ObjectInspector(this.props)
    );
  }
}

module.exports = OI;
