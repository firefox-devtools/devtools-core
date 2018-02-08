/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import type {
  Location, SourceScope, MappedScopeBindings
} from "debugger-html";

export type OriginalScope = {
  type: string,
  displayName?: string,
  bindings: {
    [originalName: string]: {
      expr: string,
      type: string
    }
  }
};

export type ScopesDataSource = {
  getSourceMapsScopes: (location: Location) => Promise<MappedScopeBindings[]|null>,
  getSourceMapsOriginalScopes: (location: Location) => Promise<?(OriginalScope[])>,
  getOriginalSourceScopes: (location: Location) => Promise<?(SourceScope[])>,
};
