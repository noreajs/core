import apiRoutes from "./api-routes";
import { NoreaBootstrap } from "../NoreaBootstrap";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes);

bootstrap.afterStart(async (app, server, port) => {
  console.log("after start");
  console.log("app name:", app.appName);
  console.log("express server port:", port);
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

/**
 * Start your app
 */
bootstrap.start();
