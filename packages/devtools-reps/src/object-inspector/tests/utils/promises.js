/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const {
  getPromiseProperties,
  isPromise,
} = require("../../utils");

describe("promises utils function", () => {
  it("is promise", () => {
    const promise = {
      contents: {
        enumerable: true,
        configurable: false,
        value: {
          frozen: false,
          ownPropertyLength: 0,
          preview: {
            kind: "Object",
            ownProperties: {},
            ownPropertiesLength: 0,
            safeGetterValues: {}
          },
          actor: "server2.conn2.child1/pausedobj36",
          promiseState: {
            state: "rejected",
            reason: {
              type: "undefined"
            },
            creationTimestamp: 1486584316133.3994,
            timeToSettle: 0.001713000237941742
          },
          class: "Promise",
          type: "object",
          extensible: true,
          sealed: false
        },
        writable: true
      }
    };

    expect(isPromise(promise)).toEqual(true);
  });

  it("getPromiseProperties", () => {
    const promise = {
      path: "root",
      contents: {
        enumerable: true,
        configurable: false,
        value: {
          frozen: false,
          ownPropertyLength: 0,
          preview: {
            kind: "Object",
            ownProperties: {},
            ownPropertiesLength: 0,
            safeGetterValues: {}
          },
          actor: "server2.conn2.child1/pausedobj36",
          promiseState: {
            state: "rejected",
            reason: {
              type: "3"
            },
            creationTimestamp: 1486584316133.3994,
            timeToSettle: 0.001713000237941742
          },
          class: "Promise",
          type: "object",
          extensible: true,
          sealed: false
        },
        writable: true
      }
    };

    const properties = getPromiseProperties(promise);
    expect(properties).toMatchSnapshot();
  });
});
