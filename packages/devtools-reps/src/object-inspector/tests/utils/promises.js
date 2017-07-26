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
          actor: "server2.conn2.child1/pausedobj36",
          promiseState: {
            state: "rejected",
            reason: {
              type: "undefined"
            },
          },
          class: "Promise",
          type: "object",
        },
      }
    };

    expect(isPromise(promise)).toEqual(true);
  });

  it("getPromiseProperties", () => {
    const promise = {
      path: "root",
      contents: {
        value: {
          actor: "server2.conn2.child1/pausedobj36",
          promiseState: {
            state: "rejected",
            reason: {
              type: "3"
            },
          },
          class: "Promise",
          type: "object",
        },
      }
    };

    const properties = getPromiseProperties(promise);
    expect(properties).toMatchSnapshot();
  });
});
