// @flow

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
    let { worker, msgId } = this;

    return function task(...args: any) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        worker.postMessage({ id, method, args });

        const listener = ({ data: result }) => {
          if (result.id !== id) {
            return;
          }

          worker.removeEventListener("message", listener);
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result.response);
          }
        };

        worker.addEventListener("message", listener);
      });
    };
  }
}

module.exports = {
  WorkerDispatcher,
};
