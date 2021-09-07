import { WorkerHelper, WorkerPoolHelper } from "..";
import { NoreaBootstrap } from "../NoreaBootstrap";
import apiRoutes from "./api-routes";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes);

bootstrap.afterStart(async (app, server, port) => {
  var count = [];
  // intiate pool
  WorkerPoolHelper.init({
    workerInstanceFilePath: `./dist/test-server/worker.js`,
    logInstanceErrors: true,
    workerPendingByDefault: true,
    pendingTasksNotificationOffset: 100,
    registeredEvents: {
      online: async () => {
        // count.push(0);
        // console.log("online baba", count.length);
        // for (let index = 0; index < 1000; index++) {
        //   WorkerPoolHelper.assignTask(Math.ceil(Math.random() * 10));
        // }
        // console.log("online baba count", WorkerPoolHelper.stats.pendingTasks);
      },
      message: (payload) => {
        if (payload.type === "memory_usage") {
          console.log(
            `Worker \`${payload.threadId}\` memory usage update delay(${payload.delay}) => `,
            payload.data
          );
          console.log(
            `Worker \`${payload.threadId}\` pool metrics`,
            WorkerPoolHelper.stats
          );
        }
      },
    },
  });

  WorkerHelper.init({
    filePath: "./dist/test-server/soloWorker.js",
    options: {
      workerData: {
        name: "Master chief",
      },
    },
    registeredEvents: {
      message: function (payload) {
        if (payload.type === "new_task") {
          WorkerPoolHelper.pendingTasks.push(payload.data);
          console.log("added result", WorkerPoolHelper.pendingTasks.length, payload.data);
        }
      },
    },
  });

  // console.log("is master", isMainThread);
  // console.log("stats", WorkerPoolHelper.stats);
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
