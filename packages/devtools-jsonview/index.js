/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { bootstrap, L10N } = require("devtools-launchpad");
const React = require("react");
const ReactDOM = require("react-dom");

const { div } = React.DOM;

// Localization
L10N.setBundle(require("./src/strings.json"));
window.L10N = L10N;

// CSS
require("./src/css/main.css");
require("devtools-reps/src/reps/reps.css");
require("devtools-modules/client/shared/components/tree/tree-view.css");
require("devtools-modules/client/shared/components/tabs/tabs.css");

// FIXME common.css and variables.css should be loaded from shared module.
require("./src/css/common.css");
require("./src/css/variables.css");

require("./src/css/general.css");
require("./src/css/search-box.css");
require("./src/css/toolbar.css");
require("./src/css/json-panel.css");
require("./src/css/text-panel.css");
require("./src/css/headers-panel.css");

const { JsonView } = require("./src/JsonView");

// this function is called when the tool connects to the client
function onConnect({ client } = {}) {
  try {
    JsonView.initialize();
  } catch (err) {
    console.log(err);
  }

  console.log("JsonView initialized OK");
}

// FIXME: load data from the client
var jsonData = {
  "firstName": "Jan",
  "lastName": "Odvarko",
  "children": {
    "son1": "Tomas",
    "daughter": "Katerina",
    "son2": "Teodor"
  },
  "longvalue": "012345678901234567890123456789012345678901123456789",
  "arr": [
    45
  ]
};

var headersData = {
  response: [
    {name: "Accept-Ranges", value: "bytes"}
  ],
  request: [
  ]
};

/**
 * This component is responsible for rendering basic
 * layout for the JSON Viewer application.
 */
var MainFrame = React.createFactory(React.createClass({
  displayName: "MainFrame",
  render() {
    return div({},
      div({ id: "content" }),
      div({ id: "headers" },
        JSON.stringify(headersData)
      ),
      div({ id: "json" },
        JSON.stringify(jsonData)
      )
    );
  }
}));

// This is the tool's root element
const root = document.createElement("div");

// Render main page layout.
ReactDOM.render(MainFrame({}), root);

// Connect to the backend. Connection happens
// asynchronously. The `onConnect` callback is
// executed when the connection is ready.
bootstrap(React, ReactDOM, root).then(onConnect);
