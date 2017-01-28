/* global define */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Make this available to both AMD and CJS environments
define(function (require, exports, module) {
  let Rep;
  let StringRep;
  let Grip;
  let MODE;
  let createFactories;
  let parseURLEncodedText;
  let parseURLParams;

  // useRepsBundle hardcoded to true while we experiment with the reps bundle.
  let useRepsBundle = true;
  if (useRepsBundle) {
    const bundle = require("devtools/client/shared/components/reps/reps");
    const { createFactory } = require("react");
    Rep = createFactory(bundle.Rep);
    StringRep = createFactory(bundle.StringRep);
    Grip = createFactory(bundle.Grip);
    MODE = bundle.MODE;
    createFactories = bundle.createFactories;
    parseURLEncodedText = bundle.parseURLEncodedText;
    parseURLParams = bundle.parseURLParams;
  } else {
    ({ createFactories, parseURLEncodedText, parseURLParams } =
      require("devtools/client/shared/components/reps/rep-utils"));
    Rep = createFactories(require("devtools/client/shared/components/reps/rep")).Rep;
    StringRep = createFactories(require("devtools/client/shared/components/reps/string").StringRep).rep;
    Grip = require("devtools/client/shared/components/reps/grip").Grip;
    MODE = require("devtools/client/shared/components/reps/constants").MODE;
  }

  exports.Rep = Rep;
  exports.StringRep = StringRep;
  exports.Grip = Grip;
  exports.MODE = MODE;
  exports.createFactories = createFactories;
  exports.parseURLEncodedText = parseURLEncodedText;
  exports.parseURLParams = parseURLParams;
});
