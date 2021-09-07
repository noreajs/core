import WorkerPoolHelper from "../helpers/WorkerPoolHelper";
import { NoreaBootstrap } from "../NoreaBootstrap";
import apiRoutes from "./api-routes";
import { isMainThread } from "worker_threads";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes);

bootstrap.afterStart(async (app, server, port) => {
  WorkerPoolHelper.init({
    workerInstanceFilePath: `./dist/test-server/worker.js`,
    logInstanceErrors: true,
    workerPendingByDefault: true,
    pendingTasksNotificationOffset: 600,
  });

  WorkerPoolHelper.assignTask(10);

  WorkerPoolHelper.assignTask(15);

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
