// @flow
/**
 * These are intended to be generic types used by Firefox, Chrome, Node, and
 * possibly others.
 *
 * They can be imported into clients by using the following Flow import:
 * `import type { Location } from 'devtools-client-adapters'`
 */

import type { FirefoxClientConnection } from "./firefox/types";
import type { ChromeClientConnection } from "./chrome/types";

/**
 * Breakpoint ID
 *
 * @memberof types
 * @static
 */
export type BreakpointId = string;

/**
 * Source ID
 *
 * @memberof types
 * @static
 */
export type SourceId = string;

/**
 * Actor ID
 *
 * @memberof types
 * @static
 */
export type ActorId = string;

/**
 * Source File Location
 *
 * @memberof types
 * @static
 */
export type Location = {
  sourceId: SourceId,
  line: number,
  column?: number,
  sourceUrl?: string
};

/**
 * Breakpoint
 *
 * @memberof types
 * @static
 */
export type Breakpoint = {
  id: BreakpointId,
  location: Location,
  loading: boolean,
  disabled: boolean,
  text: string,
  condition: ?string,
};

/**
 * Breakpoint Result is the return from an add/modify Breakpoint request
 *
 * @memberof types
 * @static
 */
export type BreakpointResult = {
  id: ActorId,
  actualLocation: Location
};

/**
 * Source
 *
 * @memberof types
 * @static
 */
export type Source = {
  id: SourceId,
  url?: string,
  sourceMapURL?: string
};

/**
 * Frame ID
 *
 * @memberof types
 * @static
 */
export type FrameId = string;

/**
 * Frame
 * @memberof types
 * @static
 */
export type Frame = {
  id: FrameId,
  displayName: string,
  location: Location,
  source?: Source,
  scope: Scope,
  // FIXME Define this type more clearly
  this: Object
};

/**
 * why
 * @memberof types
 * @static
 */
export type Why = {
  type: string
}

/**
 * Why is the Debugger Paused?
 * This is the generic state handling the reason the debugger is paused.
 * Reasons are usually related to "breakpoint" or "debuggerStatement"
 * and should eventually be specified here as an enum.  For now we will
 * just offer it as a string.
 * @memberof types
 * @static
 */
export type WhyPaused = {
  type: string
};

export type LoadedObject = {
  objectId: string,
  parentId: string,
  name: string,
  value: any
}

/**
 * Pause
 * @memberof types
 * @static
 */
export type Pause = {
  frames: Frame[],
  why: Why,
  getIn: (string[]) => any,
  loadedObjects?: LoadedObject[]
}
/**
 * Expression
 * @memberof types
 * @static
 */
export type Expression = {
   id: number,
   input: string
 };

 /**
  * Grip
  * @memberof types
  * @static
  */
export type Grip = {
   actor: string,
   class: string,
   extensible: boolean,
   frozen: boolean,
   isGlobal: boolean,
   ownPropertyLength: number,
   preview: {
     kind: string,
     url: string
   },
   sealed: boolean,
   type: string
}

/**
 * SourceText
 * @memberof types
 * @static
 */
export type SourceText = {
  id: string,
  text: string,
  contentType: string
};

/**
 * Scope
 * @memberof types
 * @static
 */
export type Scope = {
  actor: ActorId,
  parent: Scope,
  bindings: {
      // FIXME Define these types more clearly
      arguments: Array<Object>,
      variables: Object
  },
  function: {
      actor: ActorId,
      class: string,
      displayName: string,
      location: Location,
      // FIXME Define this type more clearly
      parameterNames: Array<Object>
  },
  type: string
};

/**
 * Script
 * This describes scripts which are sent to the debug server to be eval'd
 * @memberof types
 * @static
 * FIXME: This needs a real type definition
 */
export type Script = any;

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
  url: string,
  id: string,
  // FIXME: would be good to fill this out better
  tab: any,
  clientType: TargetEnvironments
};

/**
 * Connection Target specifies the location and type of target
 * where param (location) is an id
 * @memberof types
 * @static
 */
export type ConnectionTarget = {
  param: string,
  type: TargetEnvironments
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
  client: (
    (FirefoxClientConnection | ChromeClientConnection) &
    {
      clientCommands: Object,
      clientEvents: Object,
      connectClient: () => void,
      connectTab: (tab: Tab) => void,
      initPage: (actions: Actions) => void,
    }
  ),
  connTarget: ConnectionTarget,
  tab: Tab
};
