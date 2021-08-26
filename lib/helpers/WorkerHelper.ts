import {
  Worker,
  WorkerOptions,
  isMainThread,
  parentPort,
} from "worker_threads";
import Logger from "./Logger";

export default class WorkerHelper {
  private static _worker: Worker;

  /**
   * Initialize the worker
   * @param workerFilePath worker js file location
   * @param options worker options
   */
  static init(workerFilePath: string, options?: WorkerOptions) {
    this._worker = new Worker(workerFilePath, options);

    this._worker.on("message", (payload) => {
      // propagate the message
      if (!isMainThread) {
        parentPort.postMessage(payload);
      }
    });
  }

  /**
   * Get worker
   * @returns Worker
   */
  public static get worker(): Worker {
    if (this._worker) {
      return this._worker;
    } else {
      Logger.err(
        "You should call the init method before the getWorker method."
      );
    }
  }
}
