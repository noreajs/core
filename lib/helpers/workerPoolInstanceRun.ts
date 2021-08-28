import { parentPort, MessagePort } from "worker_threads";
import {
  WorkerPoolHelperEventType,
  WorkerPoolInstanceStatus,
} from "./WorkerPoolHelper";

export type WorkerPoolInstanceRunFuncParams = {
  /**
   * Pool instance initialization method
   */
  initialize?: (messagePort: MessagePort) => void | Promise<void>;
  /**
   * Task execution function
   */
  onTask: (args, messagePort: MessagePort) => void | Promise<void>;
};

/**
 * Worker pool instance run function
 * @param callback process definition
 * @returns Promise
 */
export const workerPoolInstanceRun = (
  options: WorkerPoolInstanceRunFuncParams
) => {
  return async () => {
    // update the status
    parentPort.postMessage({
      type: WorkerPoolHelperEventType.WORKER_STATUS,
      status: WorkerPoolInstanceStatus.initialized,
    });

    // first pending state
    var firstPendingThrowed = false;

    // call the initialize method
    if (options.initialize !== null && options.initialize !== null) {
      if (typeof (options.initialize as any).then === "function") {
        await options.initialize(parentPort);
      } else {
        options.initialize(parentPort);
      }
    }

    // listen to message
    parentPort.on("message", async (params) => {
      // initialize order
      if (params.type === WorkerPoolHelperEventType.INITIALIZATION_ORDER) {
        if (!firstPendingThrowed) {
          parentPort.postMessage({
            type: WorkerPoolHelperEventType.WORKER_STATUS,
            status: WorkerPoolInstanceStatus.pending,
          });
        }
      }

      // new task
      if (params.type === WorkerPoolHelperEventType.WORKER_TASK) {
        // busy
        parentPort.postMessage({
          type: WorkerPoolHelperEventType.WORKER_STATUS,
          status: WorkerPoolInstanceStatus.busy,
        });

        if (typeof (options.onTask as any).then === "function") {
          await options.onTask(params.data, parentPort);
        } else {
          options.onTask(params.data, parentPort);
        }

        // update the status
        parentPort.postMessage({
          type: WorkerPoolHelperEventType.WORKER_STATUS,
          status: WorkerPoolInstanceStatus.pending,
        });
      }
    });
  };
};
