import { Logger } from "../helpers";
import { workerPoolInstanceRun } from "../helpers/workerPoolInstanceRun";

const run = workerPoolInstanceRun({
  initialize: () => {
    Logger.log("Initializing....");
  },
  onTask: (delay) => {
    console.log("hey your delay", delay);
  },
});

run();
