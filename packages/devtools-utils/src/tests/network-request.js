jest.useFakeTimers();
const networkRequest = require("../network-request")

function fetch(status, text) {
  return () => Promise.resolve({
    status,
    text: () => Promise.resolve(text)
  })
}

describe("network request", () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  });

  it("successful fetch", async () => {
    global.fetch.mockImplementation(fetch(200, "Yay"));
    const res = await networkRequest("foo");
    expect(res).toEqual({content: "Yay"});
  })

  it("failed fetch", async () => {
    global.fetch.mockImplementation(fetch(400, "Sad"));
    try {
      const res = await networkRequest("foo");
    } catch (e) {
      expect(e.message).toEqual("failed to request foo");
    }
  })

  it("timed out fetch", async () => {
    global.fetch.mockImplementation(() => (new Promise((resolve) => {})));

    const res = networkRequest("foo")
    .catch(e => expect(e.message).toEqual("Connect timeout error"));

    jest.runAllTimers();
  })
})
