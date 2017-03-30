const { WorkerDispatcher } = require("../worker-utils")

describe("worker utils", () => {
  it("starts a worker", () => {
    const dispatcher = new WorkerDispatcher();
    global.Worker = jest.fn()
    dispatcher.start("foo");
    expect(dispatcher.worker).toEqual(global.Worker.mock.instances[0])
  })

  it("stops a worker", () => {
    const dispatcher = new WorkerDispatcher();
    const terminateMock = jest.fn();

    global.Worker = jest.fn(() => {
      return {
        terminate: terminateMock
      }
    });

    dispatcher.start();
    dispatcher.stop();

    expect(dispatcher.worker).toEqual(null)
    expect(terminateMock.mock.calls.length).toEqual(1)
  });

  it("dispatches a task", () => {
    const dispatcher = new WorkerDispatcher();
    const postMessageMock = jest.fn();
    const addEventListenerMock = jest.fn();

    global.Worker = jest.fn(() => {
      return {
        postMessage: postMessageMock,
        addEventListener: addEventListenerMock
      }
    });

    dispatcher.start();
    const task = dispatcher.task("foo")
    task("bar")

    const postMessageMockCall = postMessageMock.mock.calls[0][0];

    expect(postMessageMockCall).toEqual({
        "args": [
          "bar",
        ],
        "id": 1,
        "method": "foo",
    });

    expect(addEventListenerMock.mock.calls.length).toEqual(1);
  })

})
