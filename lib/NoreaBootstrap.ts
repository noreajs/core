import express from "express";
import cors from "cors";
import http from "http";
import https from "http";
import bodyParser from "body-parser";
import AppRoutes from "./route/AppRoutes";
import { NoreaApplication } from "./interfaces";
import ExpressParser from "./helpers/ExpressParser";
import BootstrapInitMethods from "./interfaces/BootstrapInitParamsType";

/**
 * Norea.Js application class
 */
export class NoreaBootstrap {
  /**
   * Express application instance
   */
  private app: NoreaApplication;

  /**
   * Application routes
   */
  private routes: AppRoutes;

  /**
   * Initialization parameters
   */
  private init: BootstrapInitMethods<NoreaApplication>;

  constructor(routes: AppRoutes, init: BootstrapInitMethods<NoreaApplication>) {
    this.app = ExpressParser.parseApplication(express());
    this.routes = routes;
    this.init = init;
  }

  /**
   * Get application instance
   */
  public getApplication() {
    return this.app;
  }

  /**
   * Start your app
   * @param port server port, default value = 3000
   */
  public start(port: number = 3000) {
    // init cors
    this.app.use(cors(this.init.corsOptions));

    // support application/json type post data
    this.app.use(bodyParser.json(this.init.bodyParserJsonOptions));

    //support application/x-www-form-urlencoded post data
    if (this.init.bodyParserUrlEncodedOptions) {
      const { extended, ...rest } = this.init.bodyParserUrlEncodedOptions;
      this.app.use(
        bodyParser.urlencoded({ extended: extended ?? false, ...rest })
      );
    } else {
      this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    // before start callback
    if (this.init.beforeStart) {
      this.init.beforeStart(this.app);
    }

    // set middlewares
    if (this.routes.middlewares) {
      this.routes.middlewares(this.app);
    }

    // Set api routes
    this.routes.routes(this.app);

    // App port
    const PORT = process.env.PORT || port;

    /**
     * Create server
     */

    // default server
    const defaultServer = process.env.NODE_ENV ? https.Server : http.Server;

    // new server instance
    const server = new (this.init.forceHttps === true
      ? https.Server
      : defaultServer)(this.app);

    // Start app
    server.listen(PORT, () => {
      // call after start callback
      if (this.init.afterStart) {
        this.init.afterStart(this.app, server, Number(PORT));
      } else {
        console.log("NOREA API");
        console.log("====================================================");
        console.log("Express server listening on port " + PORT);
        console.log(`Environement : ${process.env.NODE_ENV || "local"}`);
      }
    });
  }
}
