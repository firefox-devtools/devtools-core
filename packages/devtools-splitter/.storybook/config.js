/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { configure } from "@kadira/storybook";

function loadStories() {
  require("../stories/index.js");
  // You can require as many stories as you need.
}

configure(loadStories, module);
