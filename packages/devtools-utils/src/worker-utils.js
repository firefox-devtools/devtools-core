// @flow

export type Message = {
  data: {
    id: string,
    method: string,
    args: Array<any>,
  },
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
}

function workerHandler(publicInterface: Object) {
  return function workerHandler(msg: Message) {
    const { id, method, args } = msg.data;
    const response = publicInterface[method].apply(undefined, args);
    if (response instanceof Promise) {
      response.then(val => self.postMessage({ id, response: val }),
                    err => self.postMessage({ id, error: err }));
    } else {
      self.postMessage({ id, response });
    }
  };
}

module.exports = {
  WorkerDispatcher,
  workerHandler
};
