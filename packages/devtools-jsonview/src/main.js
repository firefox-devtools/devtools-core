/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* globals CustomEvent */

require("react");
require("react-dom");

// Localization
const { L10N } = require("devtools-launchpad");
L10N.setBundle(require("./strings.json"));
window.L10N = L10N;

// CSS
require("./css/main.css");
require("devtools-reps/src/reps/reps.css");
require("devtools-modules/client/shared/components/tree/tree-view.css");
require("devtools-modules/client/shared/components/tabs/tabs.css");

// FIXME common.css and variables.css should be loaded from shared module.
require("./css/common.css");
require("./css/variables.css");

require("./css/general.css");
require("./css/search-box.css");
require("./css/toolbar.css");
require("./css/json-panel.css");
require("./css/text-panel.css");
require("./css/headers-panel.css");

const { JsonView } = require("./JsonView");
JsonView.initialize();
