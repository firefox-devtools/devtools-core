/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

export type Message = {
  data: {
    id: string,
    method: string,
    args: Array<any>
  }
};

function WorkerDispatcher() {
  this.msgId = 1;
  this.worker = null;
}

WorkerDispatcher.prototype = {
  start(url) {
    this.worker = new Worker(url);
    this.worker.onerror = () => {
      console.error(`Error in worker ${url}`);
    };
  },

  stop() {
    if (!this.worker) {
      return;
    }

    this.worker.terminate();
    this.worker = null;
  },

  task(method) {
    return (...args: any) => {
      return new Promise((resolve, reject) => {
        const id = this.msgId++;
        this.worker.postMessage({ id, method, args });

        const listener = ({ data: result }) => {
          if (result.id !== id) {
            return;
          }

          this.worker.removeEventListener("message", listener);
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result.response);
          }
        };

        this.worker.addEventListener("message", listener);
      });
    };
  }
};

function workerHandler(publicInterface: Object) {
  return function (msg: Message) {
    const { id, method, args } = msg.data;
    try {
      const response = publicInterface[method].apply(undefined, args);
      if (response instanceof Promise) {
        response.then(
          val => self.postMessage({ id, response: val }),
          err => self.postMessage({ id, error: err })
        );
      } else {
        self.postMessage({ id, response });
      }
    } catch (error) {
      self.postMessage({ id, error });
    }
  };
}

function streamingWorkerHandler(
  publicInterface: Object,
  { timeout = 100 }: Object = {},
  worker: Object = self
) {
  async function streamingWorker(id, tasks) {
    let isWorking = true;

    const intervalId = setTimeout(() => {
      isWorking = false;
    }, timeout);

    const results = [];
    while (tasks.length !== 0 && isWorking) {
      const { callback, context, args } = tasks.shift();
      const result = await callback.call(context, args);
      results.push(result);
    }
    worker.postMessage({ id, status: "pending", data: results });
    clearInterval(intervalId);

    if (tasks.length !== 0) {
      await streamingWorker(id, tasks);
    }
  }

  return async function (msg: Message) {
    const { id, method, args } = msg.data;
    const workerMethod = publicInterface[method];
    if (!workerMethod) {
      console.error(`Could not find ${method} defined in worker.`);
    }
    worker.postMessage({ id, status: "start" });

    try {
      const tasks = workerMethod(args);
      await streamingWorker(id, tasks);
      worker.postMessage({ id, status: "done" });
    } catch (error) {
      worker.postMessage({ id, status: "error", error });
    }
  };
}

module.exports = {
  WorkerDispatcher,
  workerHandler,
  streamingWorkerHandler
};
