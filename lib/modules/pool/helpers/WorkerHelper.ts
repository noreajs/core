import {
  isMainThread,
  parentPort,
  Worker,
  WorkerOptions,
} from "worker_threads";
import WorkerHelperRegisteredEvents from "../interfaces/WorkerHelperRegisteredEvents";
import Logger from "../../../helpers/Logger";

export type WorkerHelperInitFuncParams = {
  filePath: string;
  options?: WorkerOptions;
  registeredEvents?: WorkerHelperRegisteredEvents;
  poolName?: string;
};

export default class WorkerHelper {
  private static _worker: Worker;
  private static _poolName: string = "WorkerHelper";

  /**
   * Initialize the worker
   * @param params initial parameters
   */
  static init(params: WorkerHelperInitFuncParams) {
    // initiate worker
    this._worker = new Worker(params.filePath, params.options);
    this._poolName = params.poolName ?? this._poolName;

    /**
     * Get registered event listener
     * @param eventName event name
     * @returns (value:any) => void | undefined
     */
    const getRegisteredEventListener = (eventName: string) => {
      if (
        params.registeredEvents &&
        Object.keys(params.registeredEvents).includes(eventName)
      ) {
        return params.registeredEvents[eventName];
      }
      return undefined;
    };

    /**
     * Call the registered event listener
     * @param eventName event name
     * @param payload Event payload
     */
    const callRegisteredEventListener = async (
      eventName: string,
      payload: any
    ) => {
      try {
        const eventListener = getRegisteredEventListener(eventName);
        if (eventListener) {
          if (typeof eventListener.then === "function") {
            await eventListener?.(payload);
          } else {
            eventListener?.(payload);
          }
        }
      } catch (error) {}
    };

    this._worker.on("message", (payload) => {
      // propagate the message
      if (!isMainThread) {
        parentPort.postMessage(payload);
      }

      callRegisteredEventListener("message", payload);
    });

    this._worker.on("online", (args) => {
      callRegisteredEventListener("online", args);
    });

    this._worker.on("error", (error) => {
      callRegisteredEventListener("error", error);
    });

    this._worker.on("exit", (exitCode) => {
      callRegisteredEventListener("exit", exitCode);
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
