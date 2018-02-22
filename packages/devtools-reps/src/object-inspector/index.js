/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow
const { createElement, createFactory, PureComponent } = require("react");
const { Provider } = require("react-redux");
const ObjectInspector = createFactory(require("./component"));
const createStore = require("./store");

let store;
class OI extends PureComponent {
  getStore() {
    return store;
  }

  render() {
    store = createStore(this.props);
    return createElement(
      Provider,
      {store},
      ObjectInspector(this.props)
    );
  }
}

module.exports = OI;
