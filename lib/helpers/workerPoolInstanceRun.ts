import { parentPort, MessagePort } from "worker_threads";
import { WorkerPoolHelperEventType } from "./WorkerPoolHelper";

export type WorkerPoolInstanceRunFuncParams = {
  initialize?: (messagePort: MessagePort) => void | Promise<void>;
  onTask: (args) => void | Promise<void>;
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
      status: "initialized",
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
            status: "pending",
          });
        }
      }

      // new task
      if (params.type === WorkerPoolHelperEventType.WORKER_TASK) {
        // busy
        parentPort.postMessage({
          type: WorkerPoolHelperEventType.WORKER_STATUS,
          status: "busy",
        });

        if (typeof (options.onTask as any).then === "function") {
          await options.onTask(params.data);
        } else {
          options.onTask(params.data);
        }

        // update the status
        parentPort.postMessage({
          type: WorkerPoolHelperEventType.WORKER_STATUS,
          status: "pending",
        });
      }
    });
  };
};
