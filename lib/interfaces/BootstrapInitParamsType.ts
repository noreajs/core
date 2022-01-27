import bodyParser from "body-parser";
import cors from "cors";
import { SessionOptions } from "express-session";
import { IHelmetConfiguration } from "helmet";
import { default as http, default as https } from "http";
import { NoreaApplication } from ".";
import {
  AfterStartFunctionType,
  BeforeInitFunctionType,
  BeforeServerListeningFunctionType,
  BeforeStartFunctionType,
} from "./INoreaBootstrap";

/**
 * Norea.Js app initialisation's parameter type
 */
declare type BootstrapInitParamsType<T> = {
  /**
   * Express application
   */
  app?: NoreaApplication;

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
   * Define if the app will use workers or not. if true `forceHttps` attribute will
   * be ignored as the server will be http
   *
   * @default false
   */
  supportWorkers?: boolean;

  /**
   * Called before the server starts listening
   *
   * @param {http.Server | https.Server} server - The current server
   */
  beforeServerListening?: BeforeServerListeningFunctionType<
    http.Server | https.Server
  >;

  /**
   * This method is executed during the initialization of the application (extension of express application).
   * It is in this method that external packages are initialized.
   *
   *  @param {T} app Express application
   *
   * Example:
   *
   * ```
   * const app = new NoreaBootstrap(apiRoutes, {
   *     beforeStart: (app, bootstrap) => {
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
  beforeInit?: BeforeInitFunctionType<T>;

  /**
   * This method is executed during the initialization of the application.
   * It is in this method that external packages are initialized.
   *
   *  @param {T} app Express application
   *
   * Example:
   *
   * ```
   * const app = new NoreaBootstrap(apiRoutes, {
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
  beforeStart?: BeforeStartFunctionType<T>;

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
   * const app = new NoreaBootstrap(apiRoutes, {
   *     beforeStart: (app) => {
   *     },
   *     afterStart: (app) => {
   *         console.log('My pretty Api is running now. What a journey!!')
   *     },
   * });
   * ```
   *
   */
  afterStart?: AfterStartFunctionType<T>;

  /**
   * Enbale cors
   * https://www.npmjs.com/package/cors
   * @default true
   */
  enableCors?: boolean;

  /**
   * CORS options
   * https://www.npmjs.com/package/cors
   */
  corsOptions?: cors.CorsOptions | cors.CorsOptionsDelegate;

  /**
   * Body parser
   * https://www.npmjs.com/package/body-parser
   */
  bodyParser?: {
    /**
     * json options
     */
    json?: boolean | bodyParser.OptionsJson;

    /**
     * URL encoded options
     */
    urlEncoded?: boolean | bodyParser.OptionsUrlencoded;
  };

  /**
   * Body parser json options
   * https://www.npmjs.com/package/body-parser
   *
   *  @deprecated Use `bodyParser.json` instead
   */
  bodyParserJsonOptions?: bodyParser.OptionsJson;

  /**
   * Body parser URL encoded options
   * https://www.npmjs.com/package/body-parser
   *
   * @deprecated Use `bodyParser.urlEncoded` instead
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
  sessionOptions?: Partial<SessionOptions>;
};

export default BootstrapInitParamsType;
