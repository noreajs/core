import express from "express";
import http from "http";
import https from "https";

export { express, http, https };

/**
 * Group many routes to a single block
 * @param prefix group prefix
 * @param middlewares group middlewares
 * @param routes group routes
 */
export function group(
  middlewares: Function[],
  routes: (router: NoreaRouter) => void
): express.Router;

export type RouteGroupParamsType = {
  routerOptions?: express.RouterOptions;
  middlewares?: express.RequestHandler[];
  routes: (router: NoreaRouter) => void;
};

export class Route {
  /**
   * Group routes together to make it a module
   * @param params group params
   */
  static group(params: RouteGroupParamsType): express.Router;
}
/**
 * Norea router
 */
export interface NoreaRouter extends express.Router { }

/**
 * Type of parameter used to initialize the initializer of the application routes......., yes you get it
 */
export type NoreaAppRoutesInitMethods = {
  /**
   * Filters that are applied before the application routes
   */
  middlewares: (app: express.Application) => void | undefined;

  /**
   * Application routes definition method
   */
  routes: (app: express.Application) => void;
};

/**
 * Norea.Js app routes definitions,
 * Instantiate this class and define the different routes of your API
 */
export class NoreaAppRoutes {
  /**
   * Filters that are applied before the application routes
   */
  middlewares: (app: express.Application) => void | undefined;

  /**
   * Application routes definition method
   */
  routes: (app: express.Application) => void;

  constructor(init: NoreaAppRoutesInitMethods);
}

/**
 * Norea.Js app initialisation's parameter type
 */
export type NoreaAppInitMethods = {
  /**
   * Force app to run on https,
   * false as default value is recommended when the app is running localy.
   * the server runs automatically in https when process.env.NODE_ENV is available
   */
  forceHttps: boolean;

  /**
   * This method is executed during the initialization of the application.
   * It is in this method that external packages are initialized.
   *
   *  @param {express.Application} app Express application
   *
   * Example:
   *
   * ```
   * const app = new NoreaApp(apiRoutes, {
   *     forceHttps: false,
   *     beforeStart: (app) => {
   *          // init cors
   *          app.use(cors());
   *          // support application/json type post data
   *          app.use(bodyParser.json());
   *          //support application/x-www-form-urlencoded post data
   *          app.use(bodyParser.urlencoded({ extended: false }));
   *     },
   * });
   * ```
   */
  beforeStart: (app: express.Application) => void | undefined;

  /**
   * This method is executed after the application has started.
   *
   *  @param {express.Application} app express application
   *  @param {https.Server | http.Server} server server
   *  @param {number} port application port
   *
   * Example:
   *
   * ```
   * const app = new NoreaApp(apiRoutes, {
   *     forceHttps: false,
   *     beforeStart: (app) => {
   *     },
   *     afterStart: (app) => {
   *         console.log('My pretty Api is running now. What a journey!!')
   *     },
   * });
   * ```
   *
   */
  afterStart: (
    app: express.Application,
    server: https.Server | http.Server,
    port: number
  ) => void | undefined;
};

/**
 * Norea.Js application class
 */
export class NoreaApp {
  constructor(routes: NoreaAppRoutes, init: NoreaAppInitMethods);

  /**
   * Get express application instance
   */
  getExpressApplication: () => express.Application;

  /**
   * Start your app
   * @param port server port, default value = 3000
   */
  start: (port?: number) => void;
}
