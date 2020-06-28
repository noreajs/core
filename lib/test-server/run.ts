import apiRoutes from "./api-routes";
import { NoreaBootstrap } from "../NoreaBootstrap";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes, {
  appName: "Norea.js Application",
  forceHttps: false,
  beforeInit: (app, bootstrap) => {
    bootstrap.setSetting({
      sessionOptions: {
        store: undefined,
      },
    });
  },
  beforeStart: (app) => {},
  afterStart: (app, server, port) => {
    console.log("App started"),
      console.log("Your app is running on port", port);
  },
});

/**
 * Start your app
 */
bootstrap.start(3000);
