import cors from "cors";
import http from "http";
import https from "http";
import bodyParser from "body-parser";
import { IHelmetConfiguration } from "helmet";
import { SessionOptions } from "express-session";

/**
 * Norea.Js app initialisation's parameter type
 */
declare type BootstrapInitParamsType<T> = {
  /**
   * App name
   */
  appName?: string;

  /**
   * App Secret key
   */
  secretKey?: string;
  /**
   * Force app to run on https,
   * false as default value is recommended when the app is running localy.
   * the server runs automatically in https when process.env.NODE_ENV is available
   */
  forceHttps?: boolean;

  /**
   * This method is executed during the initialization of the application.
   * It is in this method that external packages are initialized.
   *
   *  @param {T} app Express application
   *
   * Example:
   *
   * ```
   * const app = new NoreaApp(apiRoutes, {
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
  beforeStart?: (app: T) => void | undefined;

  /**
   * This method is executed after the application has started.
   *
   *  @param {NoreaApplication} app express application
   *  @param {https.Server | http.Server} server server
   *  @param {number} port application port
   *
   * Example:
   *
   * ```
   * const app = new NoreaApp(apiRoutes, {
   *     beforeStart: (app) => {
   *     },
   *     afterStart: (app) => {
   *         console.log('My pretty Api is running now. What a journey!!')
   *     },
   * });
   * ```
   *
   */
  afterStart?: (
    app: T,
    server: https.Server | http.Server,
    port: number
  ) => void | undefined;

  /**
   * CORS options
   * https://www.npmjs.com/package/cors
   */
  corsOptions?: cors.CorsOptions | cors.CorsOptionsDelegate;

  /**
   * Body parser json options
   * https://www.npmjs.com/package/body-parser
   */
  bodyParserJsonOptions?: bodyParser.OptionsJson;

  /**
   * Body parser URL encoded options
   * https://www.npmjs.com/package/body-parser
   */
  bodyParserUrlEncodedOptions?: bodyParser.OptionsUrlencoded;

  /**
   * Helmet configuration
   * https://helmetjs.github.io/docs/
   */
  helmetConfig?: IHelmetConfiguration;

  /**
   * Express session options
   * https://github.com/expressjs/session#readme
   */
  sessionOptions?: SessionOptions;
};

export default BootstrapInitParamsType;
