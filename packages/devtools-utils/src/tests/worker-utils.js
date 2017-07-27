/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { WorkerDispatcher, workerHandler, streamingWorkerHandler } = require("../worker-utils")
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe("worker utils", () => {
  it("starts a worker", () => {
    const dispatcher = new WorkerDispatcher();
    global.Worker = jest.fn();
    dispatcher.start("foo");
    expect(dispatcher.worker).toEqual(global.Worker.mock.instances[0]);
  });

  it("stops a worker", () => {
    const dispatcher = new WorkerDispatcher();
    const terminateMock = jest.fn();

    global.Worker = jest.fn(() => {
      return {
        terminate: terminateMock
      };
    });

    dispatcher.start();
    dispatcher.stop();

    expect(dispatcher.worker).toEqual(null);
    expect(terminateMock.mock.calls.length).toEqual(1);
  });

  it("dispatches a task", () => {
    const dispatcher = new WorkerDispatcher();
    const postMessageMock = jest.fn();
    const addEventListenerMock = jest.fn();

    global.Worker = jest.fn(() => {
      return {
        postMessage: postMessageMock,
        addEventListener: addEventListenerMock
      };
    });

    dispatcher.start();
    const task = dispatcher.task("foo");
    task("bar");

    const postMessageMockCall = postMessageMock.mock.calls[0][0];

    expect(postMessageMockCall).toEqual({
      args: ["bar"],
      id: 1,
      method: "foo"
    });

    expect(addEventListenerMock.mock.calls.length).toEqual(1);
  });

  it("test workerHandler error case", () => {
    const postMessageMock = jest.fn();
    self.postMessage = postMessageMock;

    let callee = {
      doSomething: () => { throw new Error("failed"); }
    };

    let handler = workerHandler(callee);
    handler({data: {id: 53, method: "doSomething", args: []}});

    expect(postMessageMock.mock.calls[0][0]).toEqual({
      id: 53,
      error: new Error("failed"),
    });
  });
});

it("streams a task", async () => {
  const postMessageMock = jest.fn((...args) => console.log(args));

  const worker = {
    postMessage: postMessageMock
  };

  function Promisify(result) {
    return new Promise(resolve => resolve(result));
  }
  const promise = Promisify(1);

  function makeTasks() {
    return [
      {
        callback: () => promise.then(v => v * 20)
      },
      {
        callback: () => promise.then(v => v * -10)
      }
    ];
  }

  const workerHandler = streamingWorkerHandler(
    { makeTasks },
    { timeout: 1000 },
    worker
  );
  const task = workerHandler({ data: { id: 1, method: "makeTasks", args: [] }});
  await task;

  expect(postMessageMock.mock.calls.length).toBe(3);
});
