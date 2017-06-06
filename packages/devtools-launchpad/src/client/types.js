/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

export type URL = string;

/**
 * Target Environments which are supported by this connection
 * library
 * @memberof types
 * @static
 */
export type TargetEnvironments = "chrome" | "firefox" | "node";

/**
 * Tab
 * @memberof types
 * @static
 */
export type Tab = {
  title: string,
  url: URL,
  id: string,
  // FIXME: would be good to fill this out better
  tab: any,
  clientType: TargetEnvironments,
};

/**
 * Connection Target specifies the location and type of target
 * where param (location) is an id
 * @memberof types
 * @static
 */
export type ConnectionTarget = {
  param: string,
  type: TargetEnvironments,
};

/**
 * Actions are the commands possible which should represent
 * the union of the two modules (firefox & chrome)
 *
 * TODO: This can be built from both firefox and chrome commands
 */
export type Actions = Object;

/**
 * Represent Firefox or Chrome connections by unioning
 * the two modules together which common functions
 *
 * TODO: expand on clientCommands and clientEvents
 */
export type Connection = {
  client: {
    clientCommands: Object,
    clientEvents: Object,
    connectClient: () => void,
    connectTab: (tab: Tab) => void,
    initPage: (actions: Actions) => void,
  },
  connTarget: ConnectionTarget,
  tab: Tab,
};
