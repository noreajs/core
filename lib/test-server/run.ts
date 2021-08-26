import apiRoutes from "./api-routes";
import { NoreaBootstrap } from "../NoreaBootstrap";
import WorkerPoolHelper from "../helpers/WorkerPoolHelper";
import { cpus, isMainThread, workerEmit } from "workerpool";
import Logger from "../helpers/Logger";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes);

bootstrap.afterStart(async (app, server, port) => {
  WorkerPoolHelper.initWithPath(`${__dirname}/worker.js`, {
    workerType: "thread",
    maxWorkers: cpus,
  });

  WorkerPoolHelper.exec("eventExample", [10], {
    on: (p) => {
      console.log(p);
    },
  });

  WorkerPoolHelper.exec("eventExample", [150], {
    on: (p) => {
      console.log(p);
    },
  });

  console.log("is master", isMainThread);
  console.log("stats", WorkerPoolHelper.pool.stats());
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
