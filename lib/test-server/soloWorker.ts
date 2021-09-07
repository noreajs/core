import { Logger } from "..";
import { workerData, threadId, parentPort } from "worker_threads";

/**
 * Worker process
 */
const run = async () => {
  Logger.log(`Worker \`${workerData.name ?? threadId}\`: Initiated`);

  // stream tweets
  if (parentPort) {
    for (let index = 0; index < 200; index++) {
      parentPort.postMessage({
        type: "new_task",
        data: Math.ceil(Math.random() * 10),
      });
    }
  } else {
    Logger.log(
      `Worker \`${workerData.name ?? threadId}\`: Parent port not defined`
    );
  }
};

// Run the worker process
run();
