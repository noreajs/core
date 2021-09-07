import numeral from "numeral";
import { Logger } from "../helpers";
import { threadId } from "worker_threads";
import { workerPoolInstanceRun } from "../helpers/workerPoolInstanceRun";

const run = workerPoolInstanceRun({
  initialize: () => {
    Logger.log("Initializing....");
  },
  onTask: async function (delay, messageport) {
    // console.log("hey your delay", delay);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        messageport.postMessage({
          type: "memory_usage",
          delay: delay,
          threadId: threadId,
          data: {
            arrayBuffers: numeral(process.memoryUsage().arrayBuffers).format(
              "0.000 ib"
            ),
            external: numeral(process.memoryUsage().external).format(
              "0.000 ib"
            ),
            heapTotal: numeral(process.memoryUsage().heapTotal).format(
              "0.000 ib"
            ),
            heapUsed: numeral(process.memoryUsage().heapUsed).format(
              "0.000 ib"
            ),
            rss: numeral(process.memoryUsage().rss).format("0.000 ib"),
          },
        });
        resolve(true);
      }, delay * 1000);
    });
  },
});

run();
