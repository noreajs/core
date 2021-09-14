import { NoreaBootstrap } from "..";
import apiRoutes from "./api-routes";

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes, {
  appName: "Web Server instance",
});

/**
 * Start your app
 */
bootstrap.start();
