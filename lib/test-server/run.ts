import WorkerPoolHelper from "../helpers/WorkerPoolHelper";
import { NoreaBootstrap } from "../NoreaBootstrap";
import apiRoutes from "./api-routes";
import { isMainThread } from "worker_threads";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes);

bootstrap.afterStart(async (app, server, port) => {
  var count = [];
  WorkerPoolHelper.init({
    workerInstanceFilePath: `./dist/test-server/worker.js`,
    logInstanceErrors: true,
    workerPendingByDefault: true,
    pendingTasksNotificationOffset: 1000,
    registeredEvents: {
      online: async () => {
        count.push(0);
        // console.log("online baba", count.length);
        for (let index = 0; index < 1000; index++) {
          WorkerPoolHelper.assignTask(Math.ceil(Math.random() * 10));
        }
        // console.log("online baba count", WorkerPoolHelper.stats.pendingTasks);
      },
      message: (payload) => {
        if (payload.type === "memory_usage") {
          // console.log(
          //   `Worker \`${payload.threadId}\` memory usage update delay(${payload.delay}) => `,
          //   payload.data
          // );
          // console.log(
          //   `Worker \`${payload.threadId}\` pool metrics`,
          //   WorkerPoolHelper.stats
          // );
        }
      },
    },
  });

  // WorkerPoolHelper.assignTask(Math.ceil(Math.random() * 10));

  console.log("is master", isMainThread);
  console.log("stats", WorkerPoolHelper.stats);
});

bootstrap.beforeStart(async (app) => {
  console.log("before start");
});

bootstrap.beforeInit(async (app) => {
  console.log("before init");

  bootstrap.updateInitConfig({
    appName: "Test Server API",
    forceHttps: false,
  });
});

bootstrap.beforeServerListening(async (server) => {
  console.log("Before server.listen....");
});

/**
 * Start your app
 */
bootstrap.start();
